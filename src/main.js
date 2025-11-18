import { LazyStore } from "@tauri-apps/plugin-store";
import { WebviewWindow, getCurrentWebviewWindow, getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import DEFAULT_PROMPTS from './default-prompts.js';

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 使用 ES Module 导入的 API (Vite 会处理)
  const appWindow = getCurrentWebviewWindow();
  const store = new LazyStore("prompts.json");

  // 初始化 Store
  async function initStore() {
    try {
      // LazyStore 会在第一次访问时自动加载
      const categories = await store.get('categories');
      if (!categories) {
        // 首次启动，写入默认数据
        await store.set('categories', DEFAULT_PROMPTS.categories);
        await store.set('forumLink', DEFAULT_PROMPTS.forumLink);
        await store.save();
        console.log('默认数据已加载', DEFAULT_PROMPTS.categories);
      } else {
        console.log('已加载现有数据', categories);
      }
    } catch (error) {
      console.error('初始化 Store 失败:', error);
    }
  }

  // 显示提示词列表
  async function showPrompts(categoryName) {
    try {
      console.log('showPrompts 被调用，类别:', categoryName);
      const categories = await store.get('categories');
      console.log('获取到的 categories:', categories);
      if (!categories) {
        console.error('类别数据未加载');
        return;
      }
      const category = categories.find(cat => cat.name === categoryName);
      console.log('找到的 category:', category);

      if (!category) {
        console.error('未找到类别:', categoryName);
        return;
      }

      const popupList = document.getElementById('popup-list');
      console.log('popupList 元素:', popupList);
      popupList.innerHTML = '';

      // 如果是"破甲"类别，显示子类别
      if (category.subcategories) {
        category.subcategories.forEach(subcat => {
          // 子类别标题
          const subcatHeader = document.createElement('div');
          subcatHeader.className = 'px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-700';
          subcatHeader.textContent = subcat.name;
          popupList.appendChild(subcatHeader);

          // 子类别下的提示词
          subcat.prompts.forEach(prompt => {
            const item = document.createElement('div');
            item.className = 'popup-item px-4 py-3 text-white border-b border-gray-700 last:border-b-0';
            item.textContent = prompt.keyword;
            item.addEventListener('click', (e) => {
              e.stopImmediatePropagation();
              copyPrompt(prompt.text);
            });
            popupList.appendChild(item);
          });
        });
      } else {
        // 普通类别，直接显示提示词
        category.prompts.forEach(prompt => {
          const item = document.createElement('div');
          item.className = 'popup-item px-4 py-3 text-white border-b border-gray-700 last:border-b-0';
          item.textContent = prompt.keyword;
          item.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            copyPrompt(prompt.text);
          });
          popupList.appendChild(item);
        });
      }

      // 显示弹出列表
      popupList.classList.remove('hidden');

      // 调整窗口大小以容纳弹出列表
      await appWindow.setSize({ type: 'Logical', width: 280, height: 450 });

      console.log('popupList 已显示，子元素数量:', popupList.children.length);
      console.log('窗口已扩大');

      // 点击其他地方关闭弹出列表
      setTimeout(() => {
        document.addEventListener('click', closePopup, { once: true });
      }, 100);

    } catch (error) {
      console.error('显示提示词失败:', error);
    }
  }

  // 关闭弹出列表
  async function closePopup() {
    const popupList = document.getElementById('popup-list');
    popupList.classList.add('hidden');

    // 恢复窗口原始大小
    await appWindow.setSize({ type: 'Logical', width: 280, height: 60 });
    console.log('窗口已收缩');
  }

  // 复制提示词
  async function copyPrompt(text) {
    try {
      await writeText(text);
      closePopup();

      // 视觉反馈
      const container = document.querySelector('[data-tauri-drag-region]');
      container.classList.add('copy-feedback');
      setTimeout(() => {
        container.classList.remove('copy-feedback');
      }, 300);

      console.log('已复制:', text);
    } catch (error) {
      console.error('复制失败:', error);
    }
  }

  // 打开设置窗口
  async function openSettings() {
    try {
      // 先尝试通过 getAllWebviewWindows 找到设置窗口
      const allWindows = await getAllWebviewWindows();
      console.log('所有窗口:', allWindows);

      let settingsWindow = allWindows.find(w => w.label === 'settings');

      // 如果没找到，尝试直接用 getByLabel
      if (!settingsWindow) {
        settingsWindow = await WebviewWindow.getByLabel('settings');
      }

      console.log('settingsWindow:', settingsWindow);

      if (settingsWindow) {
        console.log('尝试显示设置窗口...');
        await settingsWindow.show();
        await settingsWindow.setFocus();
        console.log('设置窗口已打开');
      } else {
        console.error('未找到设置窗口 - 所有尝试均失败');
      }
    } catch (error) {
      console.error('打开设置窗口失败:', error);
    }
  }

  // 初始化 Store
  await initStore();

  // 获取按钮
  const btnAcademic = document.getElementById('btn-academic');
  const btnStory = document.getElementById('btn-story');
  const btnCode = document.getElementById('btn-code');
  const btnJailbreak = document.getElementById('btn-jailbreak');
  const btnSettings = document.getElementById('btn-settings');
  const btnQuit = document.getElementById('btn-quit');

  // 添加事件监听器
  btnAcademic.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('点击了学术按钮');
    showPrompts('学术');
  });
  btnStory.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('点击了故事按钮');
    showPrompts('故事');
  });
  btnCode.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('点击了代码按钮');
    showPrompts('代码');
  });
  btnJailbreak.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('点击了破甲按钮');
    showPrompts('破甲');
  });
  btnSettings.addEventListener('click', openSettings);
  btnQuit.addEventListener('click', () => appWindow.close());

  console.log('Prompt Widget 已加载');
});
