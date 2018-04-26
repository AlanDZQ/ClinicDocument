<template>
  <div class="app-container">
    <el-row :gutter="24" type="flex">
      <el-col :span="6" :style="{'min-width':' 240px'}">
        <el-button type="success" class="plyt-catman-carditem plyt-catman-cardbutton plyt-catman-btn-fill"
                   @click="createCategory"><i class="el-icon-plus" aria-hidden="true"></i>Create a new category
        </el-button>
        <el-input class="plyt-catman-carditem plyt-catman-search" placeholder="Search category..."
                  suffix-icon="el-icon-search" v-model="filterKeyword"></el-input>
        <el-card>
          <el-tree class="plyt-catman-cattree" :data="categoryTree" :props="categoryProps"
                   :filter-node-method="categoryFilter" ref="catTree" highlight-current node-key="value"
                   @node-click="onTreeItemClicked" :expand-on-click-node="false"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card v-show="selectedCategoryName.length">
          <el-row type="flex">
            <el-col :span="16"><h2 class="plyt-catman-cattitle">{{selectedCategory.name}}</h2></el-col>
            <el-col :span="8">
              <el-popover
                ref="deleteCatPopover"
                placement="bottom"
                width="160"
                v-model="deleteCatPopoverVisible">
                <p style="margin: 8px;">Are you sure?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" type="text" @click="deleteCategory();deleteCatPopoverVisible = false">Yes</el-button>
                  <el-button type="danger" size="small" @click="deleteCatPopoverVisible = false">No</el-button>
                </div>
              </el-popover>
              <el-button type="danger" style="float: right" v-popover:deleteCatPopover>
                <i class="fa fa-trash-o" aria-hidden="true"></i>Delete Category
              </el-button>
            </el-col>
          </el-row>
          <h4 style="margin:20px 0">Category Name</h4>
          <div>
            <el-input v-model="selectedCategoryName">
              <el-button type="plain" slot="append" @click="updateCategoryName">
                <i class="el-icon-check" aria-hidden="true"></i> Apply
              </el-button>
            </el-input>
          </div>

          <h4 style="margin:20px 0">Parent Category</h4>
          <div>
            <el-cascader expand-trigger="click" :options="categoryCascader" v-model="selectedParentCategory"
                         :props="categoryProps" ref="catCascader" :change-on-select="true"
                         :show-all-levels="false"></el-cascader>
            <el-button type="plain" @click="updateCategoryParent"><i class="el-icon-check" aria-hidden="true"></i> Apply
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'template',
    data () {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip: 'http://192.168.0.15:5000',
        ip: '',
        deleteCatPopoverVisible: false,
        filterKeyword: '',
        categoryCascader: [],
        categoryTree: [],
        categoryProps: {
          value: 'id',
          children: 'children',
          label: 'name'
        },
        propertyData: [],
        selectedProperty: [],
        selectedCategory: {},
        selectedCategoryName: '',
        selectedParentCategory: []
      }
    },
    watch: {
      filterKeyword(val) {
        this.$refs.catTree.filter(val);
      },
      selectedCategory(){
        this.refreshParentCategory();
      }
    },
    methods: {
      loadCategories(){
        let self = this;
        self.$axios({
          method: 'get',
          url: this.ip + '/admin/getAllCategory',
//          url: 'http://121.42.252.18:5000/admin/getAllCategory',
        }).then(res => {
          if (res.data.result === 'success') {
            let tempTree = res.data.treeData;
            self.categoryCascader = tempTree;
            self.categoryTree = tempTree[0].children
          }
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      categoryFilter(value, data){
        if (!value) return true;
        return data.name.toLowerCase().search(value.toLowerCase()) !== -1
      },

      // 当前选择的节点可移动到除了原先位置之外的任意位置
      refreshCategoryCascader(catList, target, disableAll){
        if(catList === null){
          return;
        }
        catList.every(cat => {
          if (disableAll) {
            cat.disabled = true;
            if ('children' in cat) {
              this.refreshCategoryCascader(cat.children, target, true);
            }
            return true;
          }

          cat.disabled = false;
          if (cat.id === target) {
            cat.disabled = true;
            if ('children' in cat) {
              this.refreshCategoryCascader(cat.children, target, true);
            }
          } else {
            if ('children' in cat) {
              this.refreshCategoryCascader(cat.children, target, false);
            }
          }
          return true;
        });
      },
      onTreeItemClicked(selectedItem){
        console.log(selectedItem)
        this.selectedCategory = selectedItem;
        this.selectedCategoryName = selectedItem.name;
//        alert(this.selectedCategory.id)
        this.refreshCategoryCascader(this.categoryCascader, this.selectedCategory.id, false);
      },
      getCategoryPath(catList, target, path){
        let result = [];
        if(catList !== null){
          catList.every(cat => {
            let tempPath = [];
            if (cat.id === target) {
              result = path;
              return false;
            } else {
              if ('children' in cat) {
                tempPath.push(cat.id);
                result = this.getCategoryPath(cat.children, target, path.concat(tempPath));
                return result.length === 0;
              }
              return true;
            }
          });
        }
        return result;
      },
      getCategory(catList, target){
        let result = {};
        catList.every(cat => {
          if (cat.id === target) {
            result = cat;
            return false;
          } else {
            if ('children' in cat) {
              result = this.getCategory(cat.children, target);
              return result.id === undefined;
            }
            return true;
          }
        });
        return result;
      },
      refreshParentCategory(){
        let result = this.getCategoryPath(this.categoryCascader, this.selectedCategory.id, []);
        this.selectedParentCategory = result;
      },
      createCategory(){
        let self = this;
        self.$axios({
          method: 'post',
          url: this.ip + '/admin/category'
//          url: 'http://121.42.252.18:5000/admin/category'
        }).then(res => {
          if (res.data.result === 'success'){
            this.$message({
              message: 'Successfully created new category',
              type: 'success'
            });
            let result = res.data.category;
            this.categoryTree.push(result);
          }
        }).catch(response => {
          let body = response.data;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      updateCategoryName(){
        let self = this;
        self.$axios({
          method: 'patch',
          url: this.ip + `/admin/category/changeName/${self.selectedCategory.id}`,
//          url: `http://121.42.252.18:5000/admin/category/changeName/${self.selectedCategory.id}`,
          data: {
            name: self.selectedCategoryName
          }
        }).then(res => {
          if (res.data.result === 'success'){
            // 成功时
            self.selectedCategory.name = self.selectedCategoryName;
            this.$message({
              message: 'Successfully changed category name',
              type: 'success'
            });
          }
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      updateCategoryParent(){
        let self = this;
        let path = self.$refs.catCascader.value;
        let superCategoryId = path[path.length - 1];
        self.$axios({
          method: 'patch',
          url: this.ip + `/admin/category/changeParent/${self.selectedCategory.id}`,
//          url: `http://121.42.252.18:5000/admin/category/changeParent/${self.selectedCategory.id}`,
          data: {
            superCategoryId: superCategoryId
          }
        }).then(res => {
          if (res.data.result === 'success'){
            let newCat = JSON.parse(JSON.stringify(self.selectedCategory));
            self.performCategoryDelete();
            let parent = self.getCategory(self.categoryCascader, superCategoryId);
            parent.children.push(newCat);
            this.$message({
              message: 'Successfully changed parent category',
              type: 'success'
            });
          }

        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      performCategoryDelete(){
        let self = this;
        let target = self.getCategory(self.categoryCascader, self.selectedCategory.id);
        let path = self.getCategoryPath(self.categoryCascader, self.selectedCategory.id, []);
        let parent = self.categoryCascader;

        for (let i = 0; i < path.length; i++) {
          let p = path[i];
          let t = [];
          parent.every(child => {
            if (child.id === p) {
              if (i === path.length - 1) {
                let index = child.children.indexOf(target);
                child.children.splice(index, 1);
                self.selectedCategory = {};
                self.selectedCategoryName = '';
                self.selectedParentCategory = [];
              } else {
                t = child.children;
              }
              return false;
            } else {
              return true;
            }
          });
          parent = t;
        }
      },
      deleteCategory(){
        let self = this;
        self.$axios({
          method: 'delete',
          url: this.ip + `/admin/category/${self.selectedCategory.id}`,
//          url: `http://121.42.252.18:5000:5000/admin/category/${self.selectedCategory.id}`,
        }).then(response => {
          if (response.data.result === 'success') {
            self.performCategoryDelete();
            this.$message({
              message: 'Successfully deleted category',
              type: 'success'
            });
          }
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      createProp(){
        let self = this;
        self.$axios({
          method: 'post',
          url: this.ip + `/admin/category/${self.selectedCategory.id}`
//          url: `http://121.42.252.18:5000/admin/category/${self.selectedCategory.id}`
        }).then(response => {
          this.$message({
            message: 'Successfully created new property',
            type: 'success'
          });
          let body = response.data;
          let result = body.data.property;
          this.propertyData.push(result);
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      updatePropName(index, prop){
        let self = this;
        self.$axios({
          method: 'patch',
          url: this.ip + `/api/admin/category/${self.selectedCategory.id}`,
//          url: `http://121.42.252.18:5000/api/admin/category/${self.selectedCategory.id}`,
          data: {
            name: self.selectedCategory.name
          }
        }).then(response => {
          this.$message({
            message: 'Successfully updated property name',
            type: 'success'
          });
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      deleteProp(index, prop){
        let self = this;
        self.$axios({
          method: 'delete',
          url: this.ip + `/api/admin/category/${self.selectedCategory.id}/${prop.id}`
//          url: `http://121.42.252.18:5000/api/admin/category/${self.selectedCategory.id}/${prop.id}`
        }).then(response => {
          this.$message({
            message: 'Successfully deleted property',
            type: 'success'
          });
          let index = this.propertyData.indexOf(prop);
          this.propertyData.splice(index, 1);
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      deleteProps(){
        let self = this;
        let data = {property:self.selectedProperty};
        self.$axios({
          method: 'delete',
          url: this.ip+ `/api/admin/category/${self.selectedCategory.id}/property`,
//          url: `http://121.42.252.18:5000/api/admin/category/${self.selectedCategory.id}/property`,
          data: data
        }).then(response => {
          this.$message({
            message: 'Successfully deleted selected properties',
            type: 'success'
          });
          for (let i = 0; i < self.selectedProperty.length; i++) {
            let prop = self.selectedProperty[i];
            let index = this.propertyData.indexOf(prop);
            this.propertyData.splice(index, 1);
          }
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      onPropSelectionChange(selection){
        this.selectedProperty = selection;
      },
      handleAvatarSuccess(res, file) {
        this.selectedCategory.url = URL.createObjectURL(file.raw);
        console.log('upload success');
      }
    },
    computed: {},
    mounted: function () {
      let self = this;
      self.loadCategories();
    }
  }
</script>

<style scoped="scoped">
  .plyt-catman-cattree {
    border:0
  }

  .plyt-catman-carditem{
    margin-bottom:16px
  }


  .plyt-catman-btn-fill{
    width: 100%
  }


  .plyt-catman-cardbutton{
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    height: 44px
  }


  .plyt-catman-search{
    height: 44px;
  }
  .plyt-catman-search input{
    height: 44px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04)
  }



  .plyt-catman-cattitle{
    margin-bottom: 24px
  }


  .el-button-group{
    margin-bottom: 12px
  }
</style>


