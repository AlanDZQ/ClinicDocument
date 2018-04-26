from flask import Flask, make_response, jsonify, request, redirect, url_for, send_from_directory, send_file, \
    render_template, redirect, url_for
from bs4 import BeautifulSoup, Tag
import shutil
import re
from flask_pymongo import PyMongo, DESCENDING
import json
from bson import ObjectId
import io
from werkzeug.utils import secure_filename
import xhtml2pdf.pisa as pisa
import pytz
##from xhtml2pdf import pisa
from flask_cors import *
from datetime import datetime
import time
import os
import random
import zipfile
from flask.ext.login import (LoginManager, login_required, login_user,
                             logout_user, UserMixin, current_user, fresh_login_required)
from PyPDF2 import PdfFileWriter, PdfFileReader
import pdfkit

tags = ['p', 'span', 'td']
pattern1 = re.compile(r'''(.*)(\{\{.*\}\})(.*)''')
pattern2 = re.compile(r'''(\{\{.*\}\})''')
app = Flask(__name__)

app.secret_key = 'please-generate-a-random-secret_key'
CORS(app, supports_credentials=True)

# flask-login
app.secret_key = 's3cr3t'
login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'
login_manager.init_app(app)
url = 'http://192.168.43.221'


@login_manager.user_loader
def load_user(name):
    user = User(name)
    return user


app.config.update(
    MONGO_HOST='sway.red',
    MONGO_PORT=27017,
    MONGO_USERNAME='Username',
    MONGO_PASSWORD='123',
    MONGO_DBNAME='Doc'
)
mongo = PyMongo(app)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class User(UserMixin):

    def __init__(self, name, type):
        self.name = name
        self.type = type

    def is_authenticated(self):
        return True

    def is_actice(self):
        if self.type == 'admin':
            return True
        else:
            return False

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.name


@app.route('/uploadimage', methods=['POST'])
def upload():
    f = request.files['file']
    basepath = os.path.dirname(__file__)  # 当前文件所在路径
    temstr = str(time.time()) + str(random.randint(100, 999))
    upload_path = os.path.join(basepath, 'static/images',
                               temstr + secure_filename(f.filename))  # 注意：没有的文件夹一定要先创建，不然会提示没有该路径
    f.save(upload_path)
    return jsonify(
        {'url': url + ':5000/' + 'static/images/' + temstr + secure_filename(f.filename), 'result': 'success'})


##管理员登录
@app.route('/admin/login', methods=['POST'])
def login():
    re = json.loads(request.get_data())
    name = re['username']
    pwd = re['password']
    data = mongo.db.Users.find_one({'name': name})
    if data:
        if pwd == data['pwd']:
            user = User(name=name, type='admin')
            login_user(user)
            result = 'success'
        else:
            result = 'failure'
    else:
        result = 'failure'
    return jsonify({'result': result, 'token': 'admin'})


@app.route('/app/login', methods=['POST'])
def userlogin():
    re = json.loads(request.get_data())
    name = re['username']
    pwd = re['password']
    data = mongo.db.Users.find_one({'name': name})
    if data:
        if pwd == data['pwd']:
            user = User(name=name, type='user')
            login_user(user)
            result = 'success'
        else:
            result = 'failure'
    else:
        return jsonify({'result': 'failure', 'errorMessage': 'Wrong username or password'})
    return jsonify({'result': result, 'user': {'username': name, 'userId': data['id'], 'email': data['email']}})


@app.route('/app/getUserInfo/<id>', methods=['GET'])
def getUserInfo(id):
    id = float(id)
    data = mongo.db.Users.find_one_or_404({'id': id})
    return jsonify({'UserId': id, 'username': data['name'], 'email': data['email']})


##获取管理员信息
@app.route('/admin/info', methods=['GET'])
def getinfo():
    data = {}
    data['result'] = 'success'
    data['roles'] = ['admin']
    data['role'] = ['admin']
    data['name'] = 'admin'
    data['avatar'] = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    return jsonify(data)


##退出登陆
@app.route('/admin/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'result': 'success'})


##更新用户信息
@app.route('/user/update', methods=['POST'])
def updateUser():
    data = {}
    re = json.loads(request.get_data())
    data['id'] = re['id']
    data['name'] = re['username']
    data['pwd'] = re['password']
    data['email'] = re['email']
    data['tel'] = re['tel']
    data['status'] = re['status']
    data['type'] = re['username']
    try:
        mongo.db.Users.replace_one({'id': re['id']}, data)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


##添加用户
@app.route('/user/create', methods=['POST', 'GET'])
def addUser():
    re = json.loads(request.get_data())
    name = re['username']
    try:
        mongo.db.Users.find_one_or_404({'name': name})
        return jsonify({'result': 'failure', 'errorMessage': 'Exsiting user name'})
    except:
        temid = 0
        while True:
            temid += 1
            try:
                mongo.db.Users.find_one_or_404({'id': float(temid)})
                continue
            except:
                break
        mongo.db.Users.insert_one({'id': float(temid), 'name': name, 'pwd': re['password'], 'email': re['email'],
                                   'tel': re['tel'], 'status': 'enabled', 'type': 'user'})
        return jsonify({'result': 'success', 'id': temid})


##删除用户
@app.route('/user/delete', methods=['DELETE'])
def deleteUser():
    id = request.get_json()['id']
    mongo.db.Users.delete_one({'id': id})
    return jsonify({'result': 'success'})


##获取全部用户
@app.route('/user/list', methods=['GET'])
def getAllUser():
    temdic = {}
    a = False
    if request.args.get('username') != None and request.args.get('username') != '':
        temdic['name'] = request.args.get('username')
        a = True
    if request.args.get('email') != None and request.args.get('email') != '':
        temdic['email'] = request.args.get('email')
        a = True
    data = []
    temint = 1
    if '-' in request.args.get('sort'):
        temint = -1
    else:
        temint = 1
    if a:
        usertab = mongo.db.Users.find(temdic).sort('id')
    else:
        usertab = mongo.db.Users.find({}).sort('id')
    if (int(request.args.get('page'))) * int(request.args.get('limit')) > usertab.count():
        for a in range((int(request.args.get('page')) - 1) * (int(request.args.get('limit'))), usertab.count())[
                 ::temint]:
            i = usertab[a]
            data.append(
                {'id': i['id'], 'username': i['name'], 'password': i['pwd'], 'email': i['email'], 'tel': i['tel'],
                 'status': i['status']})
    else:
        for a in range((int(request.args.get('page')) - 1) * (int(request.args.get('limit'))),
                       (int(request.args.get('page'))) * int(request.args.get('limit')))[::temint]:
            if a >= usertab.count():
                break
            i = usertab[a]
            data.append(
                {'id': i['id'], 'username': i['name'], 'password': i['pwd'], 'email': i['email'], 'tel': i['tel'],
                 'status': i['status']})
    return jsonify({'items': data, 'result': 'success', 'total': usertab.count()})


##修改用户模板列表
@app.route('/admin/editUserTemplate/<id>', methods=['PUT'])
def editUserTemplate(id):
    data = request.get_json()['treeData']
    userdata = mongo.db.Users.find_one_or_404({'id': float(id)})
    userdata['treeData'] = data
    mongo.db.Users.replace_one({'id': float(id)}, userdata)
    return jsonify({'result': 'success'})


##用户端获取该用户对应的模板列表
@app.route('/app/getTemplate/<id>', methods=['GET'])
def getTemplate(id):
    data = mongo.db.Users.find_one_or_404({'id': float(id)})
    return jsonify({'result': 'success', 'treeData': data['treeData']})


@app.route('/admin/getTemplate/<id>', methods=['GET'])
def getTemplate1(id):
    data = mongo.db.Users.find_one_or_404({'id': float(id)})
    return jsonify({'result': 'success', 'treeData': data['treeData']})


# 存储新表信息
@app.route('/admin/createTemplate', methods=['POST'])
def creat_Template():
    # 得到前台的数据
    data = json.loads(request.get_data())
    html = data['html']
    soup = BeautifulSoup(html, 'lxml')
    while True:
        rand = random.randint(1, 1234567890)
        try:
            mongo.db.template.find_one_or_404({'id': float(rand)})
            continue
        except:
            break
    if isStand(soup) == True:
        template_name = data['template_name']
        father_id = data['template_category'][-1]
        mongo.db.template.insert_one(
            {'id': float(rand), 'html': html, 'template_name': template_name, 'father_id': father_id,
             'template_label': template_name.replace(' ', '')})
        result = 'success'
    else:
        result = 'failure'
    return jsonify({'result': result})


# 返回表格HTML
@app.route('/getFormDetail/<id>', methods=['GET'])
def getFormDetail(id):
    template = mongo.db.template.find_one({'id': float(id)})
    soup = BeautifulSoup(template['html'], 'lxml')
    data = {'data': PrintQue(soup, template['template_name']), 'result': 'success'}
    return jsonify(data)


def AttriToList(id):
    temlist = []
    temattri = mongo.db.attri.find({'father_id': id})
    temdic = {}
    for i in temattri:
        temdic = {'name': i['name'], 'label': i['label'], 'id': i['id']}
        temdic['children'] = AttriToList(i['id'])
        temlist.append(temdic)
    tempelate = mongo.db.template.find({'father_id': float(id)})
    for i in tempelate:
        try:
            mongo.db.que.find_one_or_404({'template_id': float(i['id'])})
            finished = True
        except:
            finished = False
        temlist.append({'name': i['template_name'], 'label': i['template_label'], 'finished': finished, 'id': i['id']})

    return temlist


def AttriToListFinished(id):
    temlist = []
    temattri = mongo.db.attri.find({'father_id': id})
    temdic = {}
    for i in temattri:
        temdic = {'name': i['name'], 'label': i['label'], 'id': i['id']}
        temdic['children'] = AttriToListFinished(i['id'])
        temlist.append(temdic)
    tempelate = mongo.db.template.find({'father_id': float(id)})
    for i in tempelate:
        try:
            mongo.db.que.find_one_or_404({'template_id': float(i['id'])})
            finished = True
            temlist.append(
                {'name': i['template_name'], 'label': i['template_label'], 'finished': finished, 'id': i['id']})
        except:
            pass

    return temlist


##获取所有finished为true的模板
@app.route('/admin/getAllFinishedTemplate', methods=['GET'])
def getAllFinishedTemplate():
    data = AttriToListFinished(0.0)
    treeData = {'id': 0.0, "label": 'Root', 'name': 'Root', 'children': data}
    return jsonify({'result': 'success', 'treeData': [treeData]})


def AttriToList1(id):
    temlist = []
    temattri = mongo.db.attri.find({'father_id': id})
    temdic = {}
    for i in temattri:
        temdic = {'name': i['name'], 'label': i['label'], 'id': i['id']}
        temdic['children'] = AttriToList1(i['id'])
        temlist.append(temdic)
    return temlist


@app.route('/admin/getAllCategory', methods=['GET'])
def getAllCate():
    data = AttriToList1(0.0)
    treeData = {'id': 0.0, "label": 'Root', 'name': 'Root', 'children': data}
    return jsonify({'result': 'success', 'treeData': [treeData]})


# 获取树形菜单
@app.route('/admin/getAllTemplate', methods=['GET'])
def getTreeTable():
    data = AttriToList(0.0)
    treeData = {'id': 0.0, "label": 'Root', 'name': 'Root', 'children': data}
    return jsonify({'result': 'success', 'treeData': [treeData]})


@app.route('/app/getTreeTable', methods=['GET'])
def getTreeTable1():
    data = AttriToList(0.0)
    treeData = {'id': 0.0, "label": 'Root', 'name': 'Root', 'children': data}
    return jsonify({'result': 'success', 'treeData': [treeData]})


# 获取填写后的信息
@app.route('/app/submitAnswer/<id>', methods=['POST'])
def submitForm(id):
    data = {}
    redata = request.get_json()
    aid = 0
    while True:
        try:
            mongo.db.data.find_one_or_404({'id': aid})
            aid += 1
            continue
        except:
            break
    ddata = redata['data']
    for i in ddata:
        data[str(i['position'])] = i['answer']
    data['time'] = datetime.now()
    data['User_id'] = float(redata['userId'])
    data['template_id'] = float(id)
    data['id'] = float(aid)
    data['name'] = redata['name']
    mongo.db.data.insert_one(data)
    return jsonify({'result': 'success'})


@app.route('/app/deleteHistory/<id>', methods=['DELETE'])
def delteHistory(id):
    id = float(id)
    try:
        mongo.db.data.delete_one({'id': id})
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'''})


# 得到历史时间
@app.route('/getTimelist/<id>', methods=['GET'])
def getTimelist(id):
    times = mongo.db.data.find({'template_id': float(id)}).distinct('time')
    timeList = []
    for time in times:
        timeList.append(time.strftime("%Y-%m-%d %H:%M:%S %f"))
    data = {'data': timeList, 'result': 'success'}
    return jsonify(data)


##添加属性
@app.route('/admin/category', methods=['POST'])
def addAttribution():
    fatherid = 0
    name = 'New Category'
    path = ''
    id = 1
    while True:
        try:
            mongo.db.attri.find_one_or_404({'id': id})
            id += 1
            continue
        except:
            break
    try:
        mongo.db.attri.insert_one(
            {'name': name, 'father_id': float(fatherid), 'id': float(id), 'label': name.replace(' ', '')})
        return jsonify({'result': 'success', 'category': {'id': id, 'label': name.replace(' ', ''), 'name': name}})
    except:
        return jsonify({'result': 'failure'})


##修改模板名称
@app.route('/admin/category/changeName/<id>', methods=['patch'])
def changeCategoryName(id):
    re = request.get_json()
    data = mongo.db.attri.find_one({'id': float(id)})
    newdata = {}
    newdata['name'] = re['name']
    newdata['id'] = float(id)
    newdata['label'] = re['name'].replace(' ', '')
    newdata['father_id'] = data['father_id']
    mongo.db.attri.replace_one({'id': float(id)}, newdata)
    return jsonify({'result': 'success'})


##修改属性名称
@app.route('/admin/category/changeParent/<id>', methods=['PATCH'])
def changeAttributionName(id):
    try:
        father_id = request.get_json()['superCategoryId']
        data = mongo.db.attri.find_one_or_404({'id': float(id)})
        data_new = {}
        data_new['id'] = data['id']
        data_new['father_id'] = float(father_id)
        data_new['name'] = data['name']
        data_new['label'] = data['label']
        mongo.db.attri.replace_one({'id': float(id)}, data_new)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


##删除属性
@app.route('/admin/category/<id>', methods=['DELETE'])
def deleteAttribution(id):
    try:
        delete(id)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


def delete(id):
    try:
        data = mongo.db.attri.find({'father_id': float(id)})
        for i in data:
            delete(i['id'])
    except:
        pass
    mongo.db.attri.delete_one({'id': float(id)})
    return


##查找已填好
@app.route('/app/getHistory/<id>', methods=['GET'])
def getAllHistory(id):
    limit = int(request.args.get('limit'))
    page = int(request.args.get('page'))
    uid = request.args.get('userId')
    datas1 = mongo.db.data.find({'template_id': float(id), 'User_id': float(uid)}).sort('time', DESCENDING)
    hastime = False
    datas = []
    count = 0
    time1 = datetime.now()
    time2 = datetime.now()
    try:
        start_time = request.args.get("start_time")[0:24]
        end_time = request.args.get("end_time")[0:24]
        time1 = datetime.strptime(start_time, "%a %b %d %Y %H:%M:%S").replace(tzinfo=pytz.timezone('GMT'))
        time2 = datetime.strptime(end_time, "%a %b %d %Y %H:%M:%S").replace(tzinfo=pytz.timezone('GMT'))
        hastime = True
    except:
        hastime = False
    if hastime:
        for i in datas1:
            if i['time'] > time1 and i['time'] < time2:
                print(type(i['time']))
                count += 1
                datas.append(i)
    else:
        count = datas1.count()
        for i in datas1:
            datas.append(i)
    history = []
    data = {'result': 'success', 'total': count}
    if (int(request.args.get('page'))) * int(request.args.get('limit')) > count:
        for n in range((page - 1) * limit, count):
            i = datas[n]
            if hastime:
                if i['time'] < time1 or i['time'] > time2:
                    continue
            data1 = mongo.db.que.find_one_or_404({'template_id': float(id)})
            data2 = data1['data']
            info = []
            for j in data2:
                info.append({'position': j['position'], 'type': j['type'], 'label': j['label'], 'opeion': j['option'],
                             'required': j['required'], 'answer': i[str(j['position'])]})
            history.append({'id': i['id'], 'date': i['time'], 'info': info, 'name': i['name']})
    else:
        for n in range((page - 1) * limit, page * limit):
            i = datas[n]
            if hastime:
                if i['time'] < time1 or i['time'] > time2:
                    continue
            data1 = mongo.db.que.find_one_or_404({'template_id': float(id)})
            data2 = data1['data']
            info = []
            for j in data2:
                info.append({'position': j['position'], 'type': j['type'], 'label': j['label'], 'opeion': j['option'],
                             'required': j['required'], 'answer': data2[str(j['position'])]})
            history.append({'id': i['id'], 'date': i['time'], 'info': info})
    data['historyList'] = history
    return jsonify(data)


# 更新信息
@app.route('/updateHistory/<id>', methods=['POST'])
def updateHistory(id):
    history_time = request.values.get("time")
    time = datetime.strptime(history_time, "%Y-%m-%d %H:%M:%S %f")
    data_new = {}
    i = 0
    while (1):
        if request.values.get(str(i)) != None:
            data_new[str(i)] = request.values.get(str(i))
            i = i + 1
        else:
            break
    data_new['time'] = time
    result = mongo.db.data.replace_one({'time': time, 'template_id': float(id)}, data_new)
    return redirect('localhost:8080/home')


# 得到可更改的历史
@app.route('/update/<id>', methods=['POST'])
def updateDate(id):
    history_data = json.loads(request.get_data())
    history_time = history_data["time"]
    hid = history_data["formId"]
    time = datetime.strptime(history_time, "%Y-%m-%d %H:%M:%S %f")
    data = mongo.db.data.find_one({'id': id})
    template = mongo.db.template.find_one({'id': id})
    soup = BeautifulSoup(template['html'], 'lxml')

    return jsonify({'data': PrintTab1(soup, data, str(hid), str(history_time), hid), 'result': 'success'})


# 获得总条数
@app.route('/getHistory/<id>/pageNum', methods=['GET'])
def getHistort_num(id):
    data = mongo.db.data.find({'id': float(id), 'father_id': float(id)})

    return jsonify({'total': data.count(), 'result': 'success'})


# 获取不能更改的历史信息
@app.route('/getHistory/<id>', methods=['GET'])
def getHistort_info(id):
    page = int(request.values.get("page"))
    if page == 1:
        k = 0
    else:
        k = (page - 1) * 10
    template = mongo.db.template.find_one({'id': id, 'father_id': float(id)})

    dataList = []
    datas = mongo.db.data.find({'id': id}).sort('time', DESCENDING).limit(10).skip(k)
    for data in datas:
        soup = BeautifulSoup(template['html'], 'lxml')
        html_str = str(PrintTab(soup, data, id))
        dataList.append({'html': html_str, 'date': data['time'].strftime("%Y-%m-%d %H:%M:%S %f")})
    dataDic = {'history': dataList, 'result': 'success'}

    return jsonify(dataDic)


# 打印PDF
@app.route('/app/pdf/<template_id>', methods=['GET'])
def download_pdf(template_id):
    id = request.args.get('id')
    data = mongo.db.data.find_one({'id': float(id)})
    template = mongo.db.template.find_one({'id': float(template_id)})
    soup = BeautifulSoup(template['html'], 'lxml')
    pdf = create_pdf(PrintTab(soup, data, template_id))
    type(pdf)
    resp = make_response(pdf)
    ##resp.headers["Content-Disposition"] = (
    ##    "attachment; filename='{0}'; filename*=UTF-8''{0}".format('test.pdf'))
    resp.headers['Content-Type'] = 'application/pdf'
    return resp


##更新Introduction
@app.route('/admin/updateTemplateIntroduction/<id>', methods=['POST'])
def updateTemplateIntroduction(id):
    id = float(id)
    try:
        data = mongo.db.que.find_one_or_404({'template_id': id})
        redata = request.get_json()
        data['title'] = redata['title']
        data['introduction'] = redata['introduction']
        mongo.db.que.replace_one({'template_id': id}, data)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


## 预览
@app.route('/app/preview', methods=['POST'])
def preview():
    template_id = request.get_json()['categoryId']
    data1 = request.get_json()['data']
    data = {}
    for i in range(len(data1)):
        data[str(1 + i)] = data1[i]['answer']
    id = request.args.get('id')
    template = mongo.db.template.find_one({'id': float(template_id)})
    soup = BeautifulSoup(template['html'], 'lxml')
    htmldata = PrintTab(soup, data, template_id)
    return jsonify({'result': 'success', 'html': htmldata})


##删除模板
@app.route('/admin/deleteTemplate/<id>', methods=['DELETE'])
def deleteTemplate(id):
    mongo.db.template.delete_one({'id': float(id)})
    try:
        mongo.db.data.delete({'template_id': float(id)})
    except:
        pass
    return jsonify({'result': 'success'})


##更新问题
@app.route('/admin/updateQuestion/<id>', methods=['POST'])
def updateQuestion(id):
    try:
        data = mongo.db.que.find_one_or_404({'template_id': float(id)})
        data1 = {}
        data1['data'] = request.get_json()['data']
        data1['template_id'] = data['template_id']
        data1['title'] = data['title']
        data1['introduction'] = data['introduction']
        mongo.db.que.replace_one({'template_id': float(id)}, data1)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


##查看填写的答案是否唯一
@app.route('/app/answerExist', methods=['GET'])
def answerExist():
    data = {}
    data['templateId'] = request.args.get('templateId')
    data['queId'] = request.args.get('queId')
    data['answer'] = request.args.get('answer')
    try:
        mongo.db.data.find_one_or_404(
            {'template_id': float(data['templateId']), str(data['queId']): str(data['answer'])})
        return jsonify({'result': 'success', 'exist': True})
    except:
        return jsonify({'result': 'success', 'exist': False})


##获取introduction
@app.route('/app/getTemplateIntroduction/<id>', methods=['GET'])
def getTemplateIntroduction(id):
    id = float(id)
    try:
        data = mongo.db.que.find_one_or_404({'template_id': id})
        return jsonify({'result': 'success', 'title': data['title'], 'introduction': data['introduction']})
    except:
        return jsonify({'result': 'failure'})


##设置问题
@app.route('/admin/postQuestion/<id>', methods=['POST'])
def SetQuestion(id):
    data = {}
    try:
        data['data'] = request.get_json()['data']
        data['title'] = request.get_json()['title']
        data['introduction'] = request.get_json()['introduction']
        data['template_id'] = float(id)
        try:
            mongo.db.que.find_one_or_404({'template_id': float(id)})
            mongo.db.que.replace_one({'template_id': float(id)}, data)
        except:

            mongo.db.que.insert_one(data)
        return jsonify({'result': 'success'})
    except:
        return jsonify({'result': 'failure'})


##获取有问题的模板的信息
@app.route('/admin/getFinishedTemplateDetail/<id>', methods=['GET'])
def getFinishedTemplateDetail(id):
    id = float(id)
    try:
        data = mongo.db.que.find_one_or_404({'template_id': id})
        data['result'] = 'success'
        data1 = mongo.db.template.find_one_or_404({'id': id})
        Tab, que_list = PrintNubTab(BeautifulSoup(data1['html']))
        return jsonify({'result': 'success', 'html': Tab, 'title': data['title'], 'introduction': data['introduction'],
                        'questionForm': data['data'], 'Nub': len(data['data'])})
    except:
        return jsonify({'result': 'failure'})


##获取带编号的模板
@app.route('/admin/getTemplateDetail/<id>', methods=['GET'])
def GetTabWithNub(id):
    data = {}
    htmldata = mongo.db.template.find_one({'id': float(id)})
    Tab, que_list = PrintNubTab(BeautifulSoup(htmldata['html']))
    try:
        tem = mongo.db.que.find_one_or_404({'template_id': float(id)})
        que_list = tem['data']
    except:
        pass
    data['html'] = Tab
    data['questionForm'] = que_list
    try:
        data['Nub'] = len(que_list)
    except:
        pass
    data['result'] = 'success'
    return jsonify(data)


##获取问题
@app.route('/app/getQuestion/<id>', methods=['GET'])
def GetQuestion(id):
    try:
        data = mongo.db.que.find_one_or_404({'template_id': float(id)})
        return jsonify({'result': 'success', 'questionForm': data['data'], 'id': id})
    except:
        return jsonify({'result': 'failure'})


@app.route('/admin/getQuestion/<id>', methods=['GET'])
def GetQuestion1(id):
    try:
        data = mongo.db.que.find_one_or_404({'template_id': float(id)})
        data1 = {'result': 'success'}
        data2 = data['data']
        data3 = []
        for i in data2:
            data3.append({'value': i['position'], 'label': i['label']})
        data1['data'] = data3
        return jsonify({'result': 'success', 'data': data3})
    except:
        return jsonify({'result': 'failure'})


@app.route('/app/getQuestionAnswer/<id>', methods=['GET'])
def GetQuestionAnswer(id):
    queid = request.args.get('QueId')
    uid = request.args.get('UserId')
    answer = {}
    try:
        data = mongo.db.data.find({'template_id': float(id), 'User_id': float(uid)})
        allans = []
        for i in data:
            allans.append({'id': i['id'], 'name': i['name']})
        return jsonify({'result': 'success', 'data': allans})
    except:
        return jsonify({'result': 'failure'})


@app.route('/app/modifyHistory/<id>', methods=['PUT'])
def modifyHistory(id):
    data1 = request.get_json()['data']
    data = {}
    for i in range(len(data1)):
        data[str(i + 1)] = data1[i]['answer']
    historyId = request.get_json()['historyId']
    newdata = mongo.db.data.find_one_or_404({'id': float(historyId)})
    data['id'] = float(historyId)
    data['template_id'] = newdata['template_id']
    data['name'] = request.get_json()['name']
    data['User_id'] = float(request.get_json()['userId'])
    data['time'] = newdata['time']
    mongo.db.data.replace_one({'id': float(historyId)}, data)
    return jsonify({'result': 'success'})


@app.route('/app/getAnswer', methods=['GET'])
def getAnswer():
    CID = request.args.get('CategeryId')
    QId = request.args.get('QueId')
    HId = request.args.get('HistoryId')
    data = mongo.db.data.find_one_or_404({'id': float(HId)})
    return jsonify({'result': 'success', 'answer': data[str(int(QId))]})


@app.route('/app/isExis', methods=['POST'])
def isExis():
    data = json.loads(request.get_data())
    Template_Id = data['Template_Id']
    QueId = data['QueId']
    Ans = data['Ans']
    try:
        mongo.db.data.find_one_or_404({'template_id': Template_Id, str(QueId): str(Ans)})
        return jsonify({'result': 'failure'})
    except:
        return jsonify({'result': 'success'})


##获取没有填问题的表格
@app.route('/GetTemNoQue', methods=['GET'])
def GetTemNoQue():
    template = mongo.db.template.find({})
    list = []
    for i in template:
        id = i['id']
        try:
            data = mongo.db.que.find_one_or_404({'template_id': float(id)})
            continue
        except:
            list.append(i['id'])
    data = {'data': list, 'result': 'success'}
    return jsonify(data)


##批量下载pdf
@app.route('/DownloadPdf/<id>', methods=['GET'])
def DownloadPdf(id):
    id = float(id)
    uid = request.args.get('userId')
    start_time = request.args.get("start_time")[0:24]
    end_time = request.args.get("end_time")[0:24]
    time1 = datetime.strptime(start_time, "%a %b %d %Y %H:%M:%S").replace(tzinfo=pytz.timezone('GMT'))
    time2 = datetime.strptime(end_time, "%a %b %d %Y %H:%M:%S").replace(tzinfo=pytz.timezone('GMT'))
    data = mongo.db.data.find({'template_id': float(id), 'User_id': float(uid)})
    template = mongo.db.template.find_one({"id": float(id)})
    soup = BeautifulSoup(template['html'], 'lxml')
    out = PdfFileWriter()
    htmldata = ''
    ranint1 = random.randint(0, 20000000)
    os.makedirs(os.getcwd() + '/tem/' + str(ranint1))
    for i in data:
        if i['time'] > time1 and i['time'] < time2:
            htmldata = PrintTab(soup, i, float(id))
            ranint = random.randint(0, 20000000)
            output = open(
                os.getcwd() + '/tem/' + str(ranint1) + '/' + str(i['time']).replace(":", ',').replace(' ', '') + '.pdf',
                'w', encoding='utf-8')
            pisa.CreatePDF(io.StringIO(htmldata), output)
            output.close()
    z = zipfile.ZipFile(os.getcwd() + '/tem/' + str(id) + '.zip', 'w', zipfile.ZIP_DEFLATED)
    for dirpath, dirnames, filenames in os.walk(os.getcwd() + '/tem/' + str(ranint1)):
        for filename in filenames:
            z.write(dirpath + '/' + filename, filename)
    z.close()
    shutil.rmtree(os.getcwd() + '/tem/' + str(ranint1))
    response = make_response(send_file(os.getcwd() + '/tem/' + str(id) + '.zip'))
    response.headers["Content-Disposition"] = "attachment; filename=" + str(id) + ".zip;"
    return response


def create_pdf(pdf_data):
    pdf = io.StringIO()
    ##pisa.CreatePDF(io.StringIO(pdf_data), pdf)
    print(pdf_data)
    pdf = pdfkit.from_string(pdf_data, False)
    return pdf


def create_many_pdf(pdf_data):
    pdf = io.StringIO()


def isStand(Soup):
    """
    判断是否标准
    :param Soup:
    :return:  boolean
    """
    for temstr in tags:
        b = Soup.find_all(temstr)
        for c in b:
            if c.name == 'p' and c.parent.name == 'td':
                continue
            match = pattern2.search(str(c.string))
            if match:
                temstring = match.group().replace("{{", '').replace("}}", '')
                temlist = [0] + temstring.split(',')
                if temlist[1] == "text":
                    continue
                elif temlist[1] == "picture":
                    continue
                elif temlist[1] == "select":
                    continue
                elif temlist[1] == 'textarea':
                    continue
                elif temlist[1] == 'checkbox':
                    continue
                elif temlist[1] == 'radio':
                    continue
                elif 'table' in temlist[1]:
                    continue
                else:
                    return False
    return True


def PrintQue(Soup, template_name):
    """
    生成有输入框的表格
    :param Soup:
    :param template_name:
    :return: heml
    """
    i = 0
    a = {}
    if type(Soup) != BeautifulSoup:
        raise Exception("parameter error")
        return
    for temstr in tags:
        b = Soup.find_all(temstr)
        for c in b:
            match = pattern2.search(str(c.string))
            if match:
                temstring = match.group().replace("{{", '').replace("}}", '')
                temlist = [i] + temstring.split(',')
                i += 1
                c.string.replace_with(pattern2.sub("", str(c.string)))
                if temlist[1] != "option":
                    c.insert(1, BeautifulSoup('<input  type="' + temlist[1] + '"name=' + str(temlist[0]) + '>'))
                else:
                    if temlist[2] == "single":
                        for no in range(len(temlist) - 3):
                            c.insert(1, BeautifulSoup(
                                '<input type="radio"   name=' + str(temlist[0]) + ' value=' + temlist[no + 3] + '>' +
                                temlist[no + 3]))
                    else:
                        temint = 0
                        for no in range(len(temlist) - 3):
                            c.insert(1, BeautifulSoup(
                                '<input type="radio" name=' + str(temlist[0]) + "_" + str(temint) + '>' + temlist[
                                    no + 3]))
                            temint += 1
    tag = Soup.body
    tag.name = "form"
    tag["id"] = "table"
    tag["action"] = "http://127.0.0.1:5000/submitForm/" + str(id)
    tag["method"] = "post"
    # tag.append(BeautifulSoup('<input type="submit",value="Submit>'))
    tag.append(BeautifulSoup('<input type="hidden" name="template_id" value=' + str(id) + '>'))
    return Soup.prettify(formatter='html')


def PrintTab1(Soup, tag_dic, template_name, time, id):
    """
    生成填好的表格，支持修改
    :param Soup:
    :param tag_dic:
    :param template_name:
    :param time:
    :param id:
    :return:
    """
    i = -1
    a = {}
    if type(Soup) != BeautifulSoup or type(tag_dic) != type(a):
        raise Exception("parameter error")
        return
    for temstr in tags:
        b = Soup.find_all(temstr)
        for c in b:
            if c.name == 'p' and c.parent.name == 'td':
                continue
            match = pattern2.search(str(c.string))
            if match:
                i += 1
                temstring = match.group().replace("{{", '').replace("}}", '')
                temlist = [i] + temstring.split(',')
                if temlist[1] == "text":

                    c.string.replace_with(pattern2.sub("", str(c.string)))
                    c.insert(1, BeautifulSoup(
                        '<input type="text" value="' + tag_dic[str(temlist[0])] + '"name=' + str(temlist[0]) + '>'))
                elif temlist[1] == "option":
                    if temlist[2] == "single":
                        c.string.replace_with(pattern2.sub("", str(c.string)))
                        temdic = {}
                        temlist1 = tag_dic[str(temlist[0])].split(',')
                        for i1 in range(len(temlist) - 3):
                            temdic[str(temlist[i1 + 3])] = "0"
                        for i2 in temlist1:
                            temdic[i2] = "1"

                        for i3 in range(len(temlist) - 3):
                            if temdic[temlist[len(temlist) - i3 - 1]] == "1":
                                c.insert(1, BeautifulSoup('<input type="radio" value=' + str(
                                    temlist[len(temlist) - i3 - 1]) + ' checked="checked" name="' + str(
                                    temlist[0]) + '" >' + temlist[len(temlist) - i3 - 1]))
                            else:
                                c.insert(1, BeautifulSoup('<input type="radio" value=' + str(
                                    temlist[len(temlist) - i3 - 1]) + ' name="' + str(temlist[0]) + '">' + temlist[
                                                              len(temlist) - i3 - 1]))
                    else:
                        c.string.replace_with(pattern2.sub("", str(c.string)))
                        temdic = {}
                        temlist1 = tag_dic[str(temlist[0])].split(',')
                        for i1 in range(len(temlist) - 3):
                            temdic[str(temlist[i1 + 3])] = "0"
                        for i2 in temlist1:
                            temdic[i2] = "1"

                        temint = 0
                        for i3 in range(len(temlist) - 3):
                            if temdic[temlist[len(temlist) - i3 - 1]] == "1":
                                c.insert(1, BeautifulSoup(
                                    '<input type="radio" checked="checked" name="' + str(temlist[0]) + '_' + str(
                                        temint) + '" >' +
                                    temlist[len(temlist) - i3 - 1]))
                                temint += 1
                            else:
                                c.insert(1, BeautifulSoup(
                                    '<input type="radio" name="' + str(temlist[0]) + '_' + str(temint) + '">' + temlist[
                                        len(temlist) - i3 - 1]))
                                temint += 1
    tag = Soup.body
    tag.name = "form"
    tag["id"] = id
    tag["action"] = "http://127.0.0.1:5000/updateHistory/" + str(id)
    tag["method"] = "post"
    # tag.append(BeautifulSoup('<input type="submit",value="Submit">'))
    tag.append(BeautifulSoup('<input type="hidden" name="template_id" value=' + str(id) + '>'))
    tag.append(BeautifulSoup('<input type="hidden" name="time" value="' + time + '">'))
    return Soup.prettify(formatter='html')


def PrintTab(Soup, tag_dic, template_id):
    i = 0
    a = {}
    if type(Soup) != BeautifulSoup or type(tag_dic) != type(a):
        raise Exception("parameter error")
        return
    for temstr in tags:
        b = Soup.find_all(temstr)
        for c in b:
            if c.name == 'p' and c.parent.name == 'td':
                continue
            match = pattern2.search(str(c.string))
            if match:
                i += 1
                temstring = match.group().replace("{{", '').replace("}}", '')
                temlist = [i] + temstring.split(',')
                if temlist[1] == "text":
                    c.string.replace_with(pattern2.sub(tag_dic[str(temlist[0])], str(c.string)))
                elif temlist[1] == "textarea":
                    c.string.replace_with(pattern2.sub(tag_dic[str(temlist[0])], str(c.string)))
                elif temlist[1] == "select":
                    c.string.replace_with(pattern2.sub(tag_dic[str(temlist[0])], str(c.string)))
                elif "table" in temlist[1]:
                    c.string.replace_with(pattern2.sub(tag_dic[str(temlist[0])], str(c.string)))
                elif temlist[1] == "picture":
                    c.string.replace_with(pattern2.sub('', str(c.string)))
                    c.insert(1, BeautifulSoup('<img src=' + tag_dic[str(str(temlist[0]))] + '">'))
                else:
                    c.string.replace_with('')
                    temstr = mongo.db.que.find_one({"template_id": float(template_id)})
                    temdata = temstr['data']
                    for tem in temdata:
                        if tem['position'] == temlist[0]:
                            temdata1 = tem['option'].split(',')
                            break
                    for temint1 in range(len(temdata1))[::-1]:
                        label = temdata1[temint1]
                        if type(tag_dic[str(temlist[0])]) != type([]):
                            tem = tag_dic[str(temlist[0])]
                            tag_dic[str(temlist[0])] = [tem]
                        if label in tag_dic[str(temlist[0])]:
                            c.insert(0, Tag(name='input', attrs={'type': 'radio', 'checked': 'checked'}))
                            c.insert(1, str(label))
                            ## '<input type="radio" checked="checked" disabled>' + str(label)).input)
                        else:
                            c.insert(0, Tag(name='input', attrs={'type': 'radio'}))
                            c.insert(1, str(label))
    return Soup.prettify(formatter='html')


def PrintNubTab(Soup):
    '''
    将模板中参数编号并返回代码
    :param Soup:
    :return:[HEML代码，参数数量]
    '''
    i = 1
    a = {}
    que_list = []
    table_list = []
    table_dic = {}
    if type(Soup) != BeautifulSoup:
        raise Exception("parameter error")
        return
    for temstr in tags:
        b = Soup.find_all(temstr)
        for c in b:
            match = pattern2.search(str(c.string))
            if match:
                table = False
                temstring = match.group().replace("{{", '').replace("}}", '')
                if 'table' in temstring:
                    table = True
                    if temstring.split('-')[0] not in table_dic.keys():
                        table_dic[temstring.split('-')[0]] = {'type': 'table', 'col': []}
                    if temstring not in table_list:
                        table_list.append(temstring)
                        if temstring.endswith('1'):
                            table_dic[temstring.split('-')[0]]['row'] = 0
                        table_dic[temstring.split('-')[0]]['col'].append({'position': i, 'type': temstring})
                    else:
                        c.string.replace_with(pattern2.sub("", str(c.string)))
                        if temstring.endswith('1'):
                            table_dic[temstring.split('-')[0]]['row'] += 1
                        continue
                temlist = [i] + temstring.split(',')
                if not table:
                    que_list.append({'position': temlist[0], 'type': temlist[1]})
                else:
                    pass
                c.string.replace_with(pattern2.sub("", str(c.string)))
                c.insert(1, "No." + str(temlist[0]))
                i += 1
    for i in table_dic.keys():
        que_list.append(table_dic[i])
    return Soup.prettify(formatter='html'), que_list


if __name__ == '__main__':
    app.run(port=5000, debug=True, host='0.0.0.0')
