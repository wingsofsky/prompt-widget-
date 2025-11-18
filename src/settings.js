import { LazyStore } from "@tauri-apps/plugin-store";
import { WebviewWindow, getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

// 全局变量
let categories = [];
let selectedCategoryIndex = null;
let editingCategoryIndex = null;
let editingPromptIndex = null;

// 渲染类别列表
function renderCategoryList() {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';

  categories.forEach((category, index) => {
    const item = document.createElement('div');
    item.className = `category-item px-4 py-3 rounded-lg ${selectedCategoryIndex === index ? 'active' : ''}`;

    const name = document.createElement('span');
    name.textContent = category.name;
    name.className = 'font-medium text-gray-700';

    item.appendChild(name);
    item.addEventListener('click', () => selectCategory(index));
    categoryList.appendChild(item);

    // 如果有子类别，也渲染子类别
    if (category.subcategories) {
      category.subcategories.forEach((subcat, subIndex) => {
        const subItem = document.createElement('div');
        subItem.className = `category-item px-4 py-2 ml-4 rounded-lg text-sm`;
        subItem.textContent = `  └ ${subcat.name}`;
        subItem.addEventListener('click', () => selectSubcategory(index, subIndex));
        categoryList.appendChild(subItem);
      });
    }
  });

  // 初始化图标
  lucide.createIcons();
}

// 选择类别
function selectCategory(index) {
  selectedCategoryIndex = index;
  renderCategoryList();
  renderPromptList();
}

// 选择子类别
function selectSubcategory(categoryIndex, subIndex) {
  selectedCategoryIndex = categoryIndex;
  editingPromptIndex = null;
  renderCategoryList();

  // 显示子类别的提示词
  const subcat = categories[categoryIndex].subcategories[subIndex];
  const promptSection = document.getElementById('prompt-section');
  const noSelection = document.getElementById('no-selection');

  noSelection.classList.add('hidden');
  promptSection.classList.remove('hidden');

  document.getElementById('category-title').textContent = `${categories[categoryIndex].name} - ${subcat.name}`;

  const promptList = document.getElementById('prompt-list');
  promptList.innerHTML = '';

  if (!subcat.prompts || subcat.prompts.length === 0) {
    promptList.innerHTML = '<p class="text-gray-400 text-center py-8">暂无提示词，点击"新增提示词"开始添加</p>';
  } else {
    subcat.prompts.forEach((prompt, pIndex) => {
      const card = window.createPromptCard(prompt, categoryIndex, pIndex, subIndex);
      promptList.appendChild(card);
    });
  }

  lucide.createIcons();
}

// 渲染提示词列表
function renderPromptList() {
  const promptSection = document.getElementById('prompt-section');
  const noSelection = document.getElementById('no-selection');

  if (selectedCategoryIndex === null) {
    noSelection.classList.remove('hidden');
    promptSection.classList.add('hidden');
    return;
  }

  noSelection.classList.add('hidden');
  promptSection.classList.remove('hidden');

  const category = categories[selectedCategoryIndex];
  document.getElementById('category-title').textContent = category.name;

  const promptList = document.getElementById('prompt-list');
  promptList.innerHTML = '';

  if (!category.prompts || category.prompts.length === 0) {
    promptList.innerHTML = '<p class="text-gray-400 text-center py-8">暂无提示词，点击"新增提示词"开始添加</p>';
    return;
  }

  category.prompts.forEach((prompt, index) => {
    const card = window.createPromptCard(prompt, selectedCategoryIndex, index);
    promptList.appendChild(card);
  });

  // 初始化图标
  lucide.createIcons();
}

// 显示类别模态框
function showCategoryModal(isEdit = false) {
  const modal = document.getElementById('modal-category');
  const title = document.getElementById('modal-category-title');
  const input = document.getElementById('input-category-name');

  if (isEdit && selectedCategoryIndex !== null) {
    title.textContent = '编辑类别';
    input.value = categories[selectedCategoryIndex].name;
    editingCategoryIndex = selectedCategoryIndex;
  } else {
    title.textContent = '新增类别';
    input.value = '';
    editingCategoryIndex = null;
  }

  modal.classList.add('show');
  input.focus();
}

// 隐藏类别模态框
function hideCategoryModal() {
  const modal = document.getElementById('modal-category');
  modal.classList.remove('show');
}


// 显示提示词模态框
function showPromptModal(isEdit = false, promptIndex = null) {
  const modal = document.getElementById('modal-prompt');
  const title = document.getElementById('modal-prompt-title');
  const keywordInput = document.getElementById('input-prompt-keyword');
  const textInput = document.getElementById('input-prompt-text');

  if (isEdit && promptIndex !== null) {
    title.textContent = '编辑提示词';
    const category = categories[selectedCategoryIndex];
    const prompt = category.prompts[promptIndex];
    keywordInput.value = prompt.keyword;
    textInput.value = prompt.text;
    editingPromptIndex = promptIndex;
  } else {
    title.textContent = '新增提示词';
    keywordInput.value = '';
    textInput.value = '';
    editingPromptIndex = null;
  }

  modal.classList.add('show');
  keywordInput.focus();
}

// 隐藏提示词模态框
function hidePromptModal() {
  const modal = document.getElementById('modal-prompt');
  modal.classList.remove('show');
}


// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 使用 ES Module 导入的 API (Vite 会处理)
  const appWindow = getCurrentWebviewWindow();
  const store = new LazyStore("prompts.json");

  // 加载所有类别
  async function loadCategories() {
    try {
      // LazyStore 会在第一次访问时自动加载
      categories = await store.get('categories') || [];
      renderCategoryList();
    } catch (error) {
      console.error('加载类别失败:', error);
    }
  }

  // 保存类别
  async function saveCategory() {
    const input = document.getElementById('input-category-name');
    const name = input.value.trim();

    if (!name) {
      alert('请输入类别名称');
      return;
    }

    try {
      if (editingCategoryIndex !== null) {
        // 编辑现有类别
        categories[editingCategoryIndex].name = name;
      } else {
        // 新增类别
        categories.push({ name, prompts: [] });
      }

      await store.set('categories', categories);
      await store.save();

      hideCategoryModal();
      loadCategories();
    } catch (error) {
      console.error('保存类别失败:', error);
      alert('保存失败，请重试');
    }
  }

  // 删除类别
  async function deleteCategory() {
    if (selectedCategoryIndex === null) return;

    if (!confirm(`确定要删除类别"${categories[selectedCategoryIndex].name}"吗？这将删除该类别下的所有提示词。`)) {
      return;
    }

    try {
      categories.splice(selectedCategoryIndex, 1);
      await store.set('categories', categories);
      await store.save();

      selectedCategoryIndex = null;
      loadCategories();
      renderPromptList();
    } catch (error) {
      console.error('删除类别失败:', error);
      alert('删除失败，请重试');
    }
  }

  // 保存提示词
  async function savePrompt() {
    if (selectedCategoryIndex === null) return;

    const keywordInput = document.getElementById('input-prompt-keyword');
    const textInput = document.getElementById('input-prompt-text');

    const keyword = keywordInput.value.trim();
    const text = textInput.value.trim();

    if (!keyword || !text) {
      alert('请填写完整的提示词信息');
      return;
    }

    try {
      const category = categories[selectedCategoryIndex];

      if (!category.prompts) {
        category.prompts = [];
      }

      if (editingPromptIndex !== null) {
        // 编辑现有提示词
        category.prompts[editingPromptIndex] = { keyword, text };
      } else {
        // 新增提示词
        category.prompts.push({ keyword, text });
      }

      await store.set('categories', categories);
      await store.save();

      hidePromptModal();
      renderPromptList();
    } catch (error) {
      console.error('保存提示词失败:', error);
      alert('保存失败，请重试');
    }
  }

  // 编辑提示词
  function editPrompt(categoryIndex, promptIndex, subcategoryIndex = null) {
    selectedCategoryIndex = categoryIndex;
    showPromptModal(true, promptIndex);
  }

  // 删除提示词
  async function deletePrompt(categoryIndex, promptIndex, subcategoryIndex = null) {
    const category = categories[categoryIndex];
    const prompt = subcategoryIndex !== null
      ? category.subcategories[subcategoryIndex].prompts[promptIndex]
      : category.prompts[promptIndex];

    if (!confirm(`确定要删除提示词"${prompt.keyword}"吗？`)) {
      return;
    }

    try {
      if (subcategoryIndex !== null) {
        category.subcategories[subcategoryIndex].prompts.splice(promptIndex, 1);
      } else {
        category.prompts.splice(promptIndex, 1);
      }

      await store.set('categories', categories);
      await store.save();

      renderPromptList();
    } catch (error) {
      console.error('删除提示词失败:', error);
      alert('删除失败，请重试');
    }
  }

  // 创建提示词卡片（需要访问 editPrompt 和 deletePrompt）
  window.createPromptCard = function(prompt, categoryIndex, promptIndex, subcategoryIndex = null) {
    const card = document.createElement('div');
    card.className = 'prompt-card bg-gray-50 rounded-lg p-4 border border-gray-200';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-2';

    const keyword = document.createElement('h3');
    keyword.className = 'text-lg font-semibold text-gray-800';
    keyword.textContent = prompt.keyword;

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    const editBtn = document.createElement('button');
    editBtn.className = 'p-1 hover:bg-gray-200 rounded transition-colors';
    editBtn.innerHTML = '<i data-lucide="edit-2" class="w-4 h-4 text-blue-600"></i>';
    editBtn.addEventListener('click', () => editPrompt(categoryIndex, promptIndex, subcategoryIndex));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'p-1 hover:bg-gray-200 rounded transition-colors';
    deleteBtn.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4 text-red-600"></i>';
    deleteBtn.addEventListener('click', () => deletePrompt(categoryIndex, promptIndex, subcategoryIndex));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    header.appendChild(keyword);
    header.appendChild(actions);

    const text = document.createElement('p');
    text.className = 'text-gray-600 text-sm';
    text.textContent = prompt.text;

    card.appendChild(header);
    card.appendChild(text);

    return card;
  };

  await loadCategories();

  // 类别相关按钮
  document.getElementById('btn-add-category').addEventListener('click', () => showCategoryModal(false));
  document.getElementById('btn-edit-category').addEventListener('click', () => showCategoryModal(true));
  document.getElementById('btn-delete-category').addEventListener('click', deleteCategory);
  document.getElementById('btn-cancel-category').addEventListener('click', hideCategoryModal);
  document.getElementById('btn-save-category').addEventListener('click', saveCategory);

  // 提示词相关按钮
  document.getElementById('btn-add-prompt').addEventListener('click', () => showPromptModal(false));
  document.getElementById('btn-cancel-prompt').addEventListener('click', hidePromptModal);
  document.getElementById('btn-save-prompt').addEventListener('click', savePrompt);

  // 关闭窗口
  document.getElementById('btn-close').addEventListener('click', () => {
    appWindow.hide();
  });

  // 模态框点击外部关闭
  document.getElementById('modal-category').addEventListener('click', (e) => {
    if (e.target.id === 'modal-category') {
      hideCategoryModal();
    }
  });

  document.getElementById('modal-prompt').addEventListener('click', (e) => {
    if (e.target.id === 'modal-prompt') {
      hidePromptModal();
    }
  });

  // Enter 键保存
  document.getElementById('input-category-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveCategory();
    }
  });

  // 帮助模态框功能
  function showHelpModal() {
    const modal = document.getElementById('modal-help');
    modal.classList.add('show');
    // 重新初始化图标
    lucide.createIcons();
  }

  function hideHelpModal() {
    const modal = document.getElementById('modal-help');
    modal.classList.remove('show');
  }

  // 帮助按钮
  document.getElementById('btn-help').addEventListener('click', showHelpModal);
  document.getElementById('btn-close-help').addEventListener('click', hideHelpModal);
  document.getElementById('btn-close-help-bottom').addEventListener('click', hideHelpModal);

  // 点击帮助模态框外部关闭
  document.getElementById('modal-help').addEventListener('click', (e) => {
    if (e.target.id === 'modal-help') {
      hideHelpModal();
    }
  });

  console.log('设置页面已加载');
});
