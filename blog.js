// 翻译数据
const translations = {
    'zh': {
        'pageTitle': 'Yue’s Blog',
        'tagsLabel': '文章标签：',
        'searchPlaceholder': '搜索博客文章...',
        'searchButton': '搜索',
        'blogListTitle': '所有文章',
        'nextPage': '下一页',
        'languageText': '中 / EN',
        'tags': {
            'ai': 'AI',
            'jobhunting': '求职',
            'gaming': '游戏',
            'personal-growth': '个人成长'
        }
    },
    'en': {
        'pageTitle': 'Yue‘s Blog',
        'tagsLabel': 'Tags:',
        'searchPlaceholder': 'Search blog posts...',
        'searchButton': 'Search',
        'blogListTitle': 'All Posts',
        'nextPage': 'Next',
        'languageText': 'EN / 中',
        'tags': {
            'ai': 'AI',
            'jobhunting': 'Job Hunting',
            'gaming': 'Gaming',
            'personal-growth': 'Career Development'
        }
    }
};

// 当前语言
let currentLang = 'en'; // 默认为英文

// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage();
}

// 更新页面语言
function updateLanguage() {
    // 更新UI元素
    document.getElementById('page-title').textContent = translations[currentLang].pageTitle;
    document.getElementById('tags-label').textContent = translations[currentLang].tagsLabel;
    document.getElementById('search-input').placeholder = translations[currentLang].searchPlaceholder;
    document.getElementById('search-btn').textContent = translations[currentLang].searchButton;
    document.getElementById('blog-list-title').textContent = translations[currentLang].blogListTitle;
    document.getElementById('next-page-btn').textContent = translations[currentLang].nextPage;
    document.getElementById('language-text').textContent = translations[currentLang].languageText;
    
    // 更新标签文本
    Object.keys(translations[currentLang].tags).forEach(tag => {
        const element = document.getElementById(`tag-${tag}-btn`);
        if (element) {
            element.textContent = translations[currentLang].tags[tag];
        }
    });
    // 更新博客文章中的标签文本
    Object.keys(translations[currentLang].tags).forEach(tag => {
        document.querySelectorAll(`.tag-text-${tag}`).forEach(element => {
        element.textContent = translations[currentLang].tags[tag];
        });
    });

    // 更新博客标题和副标题
    document.querySelectorAll('[id^="blog-title-"]').forEach(element => {
        if (element.id.endsWith(`-${currentLang}`)) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
    
    document.querySelectorAll('[id^="blog-subtitle-"]').forEach(element => {
        if (element.id.endsWith(`-${currentLang}`)) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}
// 分页相关变量
const itemsPerPage = 5; // 每页显示5篇文章
let currentPage = 1; // 当前页码
let totalFilteredItems = 0; // 筛选后的总文章数

// 初始化分页
function initPagination() {
    const blogItems = document.querySelectorAll('.blog-item');
    totalFilteredItems = blogItems.length;
    
    // 计算总页数
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
    
    // 更新分页UI
    updatePaginationUI(totalPages);
    
    // 显示第一页内容
    showPage(1);
}

// 更新分页UI
function updatePaginationUI(totalPages) {
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.innerHTML = '';
    
    // 如果只有一页，不显示分页
    if (totalPages <= 1) {
        document.querySelector('.pagination').style.display = 'none';
        return;
    } else {
        document.querySelector('.pagination').style.display = 'flex';
    }
    
    // 创建页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('div');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            showPage(i);
        });
        paginationContainer.appendChild(pageBtn);
    }
    
    // 如果有多于一页，添加"下一页"按钮
    if (totalPages > 1) {
        const nextBtn = document.createElement('div');
        nextBtn.className = 'page-btn next';
        nextBtn.id = 'next-page-btn';
        nextBtn.textContent = translations[currentLang].nextPage;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
}

// 显示指定页码的内容
function showPage(pageNum) {
    // 获取所有可见的博客项（可能已经被筛选）
    const blogItems = Array.from(document.querySelectorAll('.blog-item'))
        .filter(item => item.style.display !== 'none');
    
    // 计算显示范围
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, blogItems.length);
    
    // 隐藏所有文章
    blogItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 更新当前页码
    currentPage = pageNum;
    
    // 更新分页UI的活动状态
    document.querySelectorAll('.page-btn').forEach(btn => {
        if (!btn.classList.contains('next')) {
            btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
        }
    });
}

// 筛选后更新分页
function updatePaginationAfterFilter() {
    // 获取筛选后可见的文章
    const visibleItems = document.querySelectorAll('.blog-item[style=""]');
    totalFilteredItems = visibleItems.length;
    
    // 重新计算页数
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
    
    // 重置到第一页
    currentPage = 1;
    
    // 更新分页UI
    updatePaginationUI(totalPages);
    
    // 显示第一页
    showPage(1);
}

function filterByTag(tag) {
    const tagButton = document.getElementById(`tag-${tag}-btn`);
    
    // 切换激活状态
    tagButton.classList.toggle('active');
    
    // 获取所有激活的标签
    const activeTags = Array.from(document.querySelectorAll('.tag-btn.active'))
        .map(button => button.getAttribute('data-tag'));
    
    // 筛选博客项目
    const blogItems = document.querySelectorAll('.blog-item');
    
    if (activeTags.length === 0) {
        // 如果没有激活的标签，显示所有项目
        blogItems.forEach(item => item.style.display = '');
        document.getElementById('blog-list-title').textContent = translations[currentLang].blogListTitle;
    } else {
        // 否则，只显示包含所有激活标签的项目
        blogItems.forEach(item => {
            const itemTags = item.getAttribute('data-tags').split(' ');
            const shouldShow = activeTags.every(tag => itemTags.includes(tag));
            item.style.display = shouldShow ? '' : 'none';
        });
        
        // 更新标题以反映筛选
        const tagNames = activeTags.map(tag => translations[currentLang].tags[tag]).join(' + ');
        document.getElementById('blog-list-title').textContent = `${tagNames} 相关文章`;
    }
    
    // 更新分页
    updatePaginationAfterFilter();
}

// 修改searchBlogs函数以支持分页
function searchBlogs() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const blogItems = document.querySelectorAll('.blog-item');
    
    if (searchTerm.trim() === '') {
        // 如果搜索词为空，显示所有项目
        blogItems.forEach(item => item.style.display = '');
        document.getElementById('blog-list-title').textContent = translations[currentLang].blogListTitle;
        
        // 更新分页
        updatePaginationAfterFilter();
        return;
    }
    
    // 重置所有标签的激活状态
    document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
    
    // 搜索逻辑
    let found = false;
    blogItems.forEach(item => {
        const title = item.querySelector('.blog-title').textContent.toLowerCase();
        const subtitle = item.querySelector('.blog-subtitle').textContent.toLowerCase();
        const tags = item.getAttribute('data-tags').toLowerCase();
        
        if (title.includes(searchTerm) || subtitle.includes(searchTerm) || tags.includes(searchTerm)) {
            item.style.display = '';
            found = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // 更新标题以反映搜索
    document.getElementById('blog-list-title').textContent = `"${searchTerm}" 的搜索结果`;
    
    // 如果没有结果，显示提示
    if (!found) {
        document.getElementById('blog-list-title').textContent = `没有找到 "${searchTerm}" 的结果`;
    }
    
    // 更新分页
    updatePaginationAfterFilter();
}

// 页面加载时初始化
window.onload = function() {
    updateLanguage();
    sortBlogsByDate();
    initPagination(); // 初始化分页
    
    // 添加回车键搜索功能
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBlogs();
        }
    });
};

// 按发布日期排序博客
function sortBlogsByDate() {
    const blogList = document.getElementById('blog-list');
    const blogItems = Array.from(blogList.querySelectorAll('.blog-item'));
    
    // 按日期排序（从新到旧）
    blogItems.sort((a, b) => {
        const dateA = new Date(a.querySelector('.blog-date').textContent);
        const dateB = new Date(b.querySelector('.blog-date').textContent);
        return dateB - dateA;
    });
    
    // 重新添加到列表
    blogItems.forEach(item => blogList.appendChild(item));
}



/*
=====================================================================
                        使用指南
=====================================================================

1. 添加新标签：
   - 在HTML中复制现有标签按钮，并修改以下属性：
     * id: 确保唯一（例如：tag-newtag-btn）
     * class: 添加颜色类（例如：tag-newtag）
     * data-tag: 设置标签标识符（例如：newtag）
     * onclick: 保持一致（例如：filterByTag('newtag')）
   - 在CSS中添加新标签的颜色样式：
     .tag-newtag { ... }
   - 在translations对象中添加中英文翻译:
     'zh': { 'tags': { 'newtag': '新标签' } }
     'en': { 'tags': { 'newtag': 'New Tag' } }

2. 添加新博客文章：
   - 复制现有的.blog-item元素
   - 更新以下内容：
     * data-tags: 设置相关标签（空格分隔）
     * blog-title-X-en/zh: 设置英文和中文标题（X是递增的数字）
     * blog-date: 设置发布日期（格式：YYYY-MM-DD）
     * blog-subtitle-X-en/zh: 设置英文和中文副标题
     * 添加或删除相关标签span元素
     * 更新两个链接的href属性为实际链接

3. 修改文章：
   - 直接更新相应的标题、副标题、日期或链接元素
   - 要更改关联的标签，修改data-tags属性和标签span元素

4. 添加新语言（如果需要）：
   - 在translations对象中添加新语言条目
   - 修改toggleLanguage()函数以支持多语言循环
*/