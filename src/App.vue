<script setup>
import { ref, onMounted } from 'vue';


// 定义常量
const date = ref('');
const time = ref('');
const toradio = ref('');
const frep = ref('');
const mode = ref('');
const call = ref('');
const rst = ref('');
const list = ref([]);

// IndexedDB 相关操作
const dbName = 'logDatabase';
const storeName = 'logStore';

// 打开数据库
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = (event) => {
      console.error('Database error: ' + event.target.errorCode);
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    };
  });
};

// 添加记录到 IndexedDB
const addRecordToDB = async (record) => {
  const db = await openDatabase();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  store.add(record);
  transaction.oncomplete = () => {
    console.log('Record added successfully');
  };
  transaction.onerror = (event) => {
    console.error('Transaction error: ' + event.target.errorCode);
  };
};

// 从 IndexedDB 获取记录
const getRecordsFromDB = async () => {
  const db = await openDatabase();
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();
  request.onsuccess = (event) => {
    list.value = event.target.result;
    // 初始化每个记录的 showDelete 属性
    list.value.forEach(item => {
      item.showDelete = false;
    });
  };
  request.onerror = (event) => {
    console.error('Request error: ' + event.target.errorCode);
  };
};

// 从 IndexedDB 删除记录
const deleteRecordFromDB = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  store.delete(id);
  transaction.oncomplete = () => {
    console.log('Record deleted successfully');
  };
  transaction.onerror = (event) => {
    console.error('Transaction error: ' + event.target.errorCode);
  };
};

// 从 IndexedDB 加载数据
onMounted(() => {
  getRecordsFromDB();
});

// 添加记录
function addtodo() {
  // 检查所有输入字段是否为空
  if (!date.value || !time.value || !toradio.value || !frep.value || !mode.value || !call.value || !rst.value) {
    return; // 如果任意字段为空，直接返回，不执行添加操作
  }

  const newRecord = {
    date: date.value,
    time: time.value,
    toradio: toradio.value,
    frep: frep.value,
    mode: mode.value,
    call: call.value,
    rst: rst.value,
    showDelete: false, // 初始化 showDelete 属性
  };

  list.value.push(newRecord);

  // 保存到 IndexedDB
  addRecordToDB(newRecord);

  date.value = '';
  time.value = '';
  toradio.value = '';
  frep.value = '';
  mode.value = '';
  call.value = '';
  rst.value = '';
}

// 删除记录
function deltodo(index) {
  const id = list.value[index].id;
  list.value.splice(index, 1);

  // 保存到 IndexedDB
  deleteRecordFromDB(id);
}


// 显示删除按钮
function showDeleteButton(index) {
  list.value[index].showDelete = true;
}

// 隐藏删除按钮
function hideDeleteButton(index) {
  list.value[index].showDelete = false;
}

// 刷新页面
function refreshPage() {
  location.reload();
}

</script>

<!-- 组件 -->
<template>
  <div class="header">
    <header>
      <div class="hd-left"><img src="./assets/georgewu.ico"><p>CN_HAM</p></div>
      <div class="hd-right"><p>业余无线电通联日志</p></div>
    </header>
  </div>

  <!-- 标题 -->
  <div class="addbox-title">
    <div class="addinput-title">
      <p>日期</p><p>时间</p><p>对方呼号</p><p>频率</p><p>通信模式</p><p>对方</p><p>双方</p>
    </div>
    <div class="addbutton-title">
      <p>操作</p>
    </div>
  </div>
  <!-- 输入框/按钮 -->
  <div class="addbox">
    <div class="addinput">
      <input v-model="date" type="text" placeholder="日期">
      <input v-model="time" type="text" placeholder="时间">
      <input v-model="toradio" type="text" placeholder="对方呼号">
      <input v-model="frep" type="text" placeholder="频率">
      <input v-model="mode" type="text" placeholder="通信模式">
      <input v-model="call" type="text" placeholder="对方">
      <input v-model="rst" type="text" placeholder="双方">
    </div>
    <div class="addbutton">
      <button @click="addtodo"><p>记录</p></button>
    </div>
  </div>

  <!-- 列表 -->
  <!-- 大标题 -->
  <div class="addlist-title"><h1>列表</h1><button @click="refreshPage">刷新</button></div>
  <transition-group name="list" tag="div">
    <div v-for="(item, index) in list" :key="index" class="add-list" @mouseenter="showDeleteButton(index)" @mouseleave="hideDeleteButton(index)">
      <!-- 记录事件 -->
      <div class="addbox-list">
        <div class="addinput-list">
          <span>{{ item.date }}</span>
          <span>{{ item.time }}</span>
          <span class="toradio">{{ item.toradio }}</span>
          <span class="frep">{{ item.frep }}</span>
          <span>{{ item.mode }}</span>
          <span>{{ item.call }}</span>
          <span>{{ item.rst }}</span>
        </div>
        <div class="delbutton" :class="{ 'show': item.showDelete }">
          <button @click="deltodo(index)"><p>删除</p></button>
        </div>
      </div>
    </div>
  </transition-group>

  <!--底部版权信息-->
  <footer>
    <div class="ft-box"><p>©️2025 CopyRightBy CN_HAM</p></div>
  </footer>

  <!--关于-->
  <div class="inf" title="关于">
    <button onclick="alert('版本：1.1.2 / 项目所有人：伍发坚 GEORGEWU')">i</button>
  </div>
</template>

<!-- 样式 -->
<style scoped>
.toradio {
  color: #a85230;
}
.frep {
  color: #cc3838;
}

transition-group {
  margin-bottom: 50px;
}

/* 过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-25px);
}

/* 删除按钮样式 */
.delbutton {
  display: none;
}
.delbutton.show {
  display: grid;
}
</style>