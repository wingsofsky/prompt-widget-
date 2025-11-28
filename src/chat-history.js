// ======================
// Tab 切换功能
// ======================
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;

    // 移除所有 active 类
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 添加当前 active 类
    button.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // 重新初始化图标
    lucide.createIcons();

    // 如果切换到聊天记录tab，加载路径
    if (tabName === 'chats') {
      loadChatRootPath();
    }
  });
});

// ======================
// 聊天记录功能
// ======================
let currentChatCategory = null;
let chatRootPath = '';

// 加载聊天记录路径
async function loadChatRootPath() {
  try {
    const path = await store.get('chat_root_path');
    if (path) {
      chatRootPath = path;
      document.getElementById('chat-root-path').value = path;
      await loadChatCategories();
    }
  } catch (error) {
    console.error('加载聊天记录路径失败:', error);
  }
}

// 选择文件夹
document.getElementById('btn-select-folder').addEventListener('click', async () => {
  try {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择聊天记录文件夹'
    });

    if (selected) {
      chatRootPath = selected;
      document.getElementById('chat-root-path').value = selected;
      await store.set('chat_root_path', selected);
      await store.save();
      await loadChatCategories();
    }
  } catch (error) {
    console.error('选择文件夹失败:', error);
    alert('选择文件夹失败: ' + error.message);
  }
});

// 刷新聊天记录
document.getElementById('btn-refresh-chats').addEventListener('click', async () => {
  if (chatRootPath) {
    await loadChatCategories();
  }
});

// 加载聊天类别（文件夹）
async function loadChatCategories() {
  if (!chatRootPath) return;

  try {
    const { readDir } = await import('@tauri-apps/plugin-fs');
    const entries = await readDir(chatRootPath);

    const categoryListEl = document.getElementById('chat-category-list');
    categoryListEl.innerHTML = '';

    // 过滤出文件夹
    const folders = entries.filter(entry => entry.isDirectory);

    if (folders.length === 0) {
      categoryListEl.innerHTML = '<div class="text-gray-400 text-sm p-4 text-center">该文件夹中没有子文件夹</div>';
      return;
    }

    folders.forEach(folder => {
      const item = document.createElement('div');
      item.className = 'file-item px-4 py-3 rounded-lg flex items-center gap-2';
      item.innerHTML = `
        <i data-lucide="folder" class="w-4 h-4 text-yellow-600"></i>
        <span class="font-medium text-gray-700">${folder.name}</span>
      `;
      item.addEventListener('click', () => selectChatCategory(folder.name));
      categoryListEl.appendChild(item);
    });

    lucide.createIcons();
  } catch (error) {
    console.error('读取文件夹失败:', error);
    document.getElementById('chat-category-list').innerHTML =
      '<div class="text-red-400 text-sm p-4 text-center">读取失败: ' + error.message + '</div>';
  }
}

// 选择聊天类别
async function selectChatCategory(categoryName) {
  currentChatCategory = categoryName;

  // 更新UI active状态
  document.querySelectorAll('#chat-category-list .file-item').forEach(item => {
    item.classList.remove('active');
    const span = item.querySelector('span');
    if (span && span.textContent.trim() === categoryName) {
      item.classList.add('active');
    }
  });

  await loadChatFiles(categoryName);
}

// 加载聊天文件列表
async function loadChatFiles(categoryName) {
  try {
    const { readDir } = await import('@tauri-apps/plugin-fs');
    const categoryPath = `${chatRootPath}/${categoryName}`;
    const entries = await readDir(categoryPath);

    const fileListEl = document.getElementById('chat-file-list');
    fileListEl.innerHTML = '';

    // 过滤.md文件
    const mdFiles = entries.filter(entry =>
      entry.isFile && entry.name.endsWith('.md')
    );

    if (mdFiles.length === 0) {
      fileListEl.innerHTML = '<div class="text-gray-400 text-sm p-4 text-center">没有找到.md文件</div>';
      return;
    }

    mdFiles.sort((a, b) => b.name.localeCompare(a.name));

    mdFiles.forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-indigo-50 transition-colors';
      const displayName = file.name.replace('.md', '');
      item.innerHTML = `
        <i data-lucide="file-text" class="w-4 h-4 text-blue-600"></i>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-700 truncate">${displayName}</div>
          <div class="text-xs text-gray-500">双击打开</div>
        </div>
      `;

      // 双击事件打开新窗口
      item.addEventListener('dblclick', () => openChatFile(categoryName, file.name));

      fileListEl.appendChild(item);
    });

    lucide.createIcons();
  } catch (error) {
    console.error('读取文件列表失败:', error);
    document.getElementById('chat-file-list').innerHTML =
      '<div class="text-red-400 text-sm p-4 text-center">读取失败: ' + error.message + '</div>';
  }
}

// 用系统默认程序打开聊天文件
async function openChatFile(categoryName, fileName) {
  try {
    const { Command } = await import('@tauri-apps/plugin-shell');

    const filePath = `${chatRootPath}/${categoryName}/${fileName}`;

    // Windows: 使用 cmd /c start 命令打开文件
    // 这会使用系统默认的 .md 文件关联程序
    const command = Command.create('cmd', ['/c', 'start', '', filePath]);

    await command.execute();

    console.log('已用默认程序打开文件:', filePath);

  } catch (error) {
    console.error('打开文件失败:', error);
    alert('打开文件失败: ' + error.message);
  }
}
