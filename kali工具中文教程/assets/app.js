/* ============================================================
   Kali Linux 工具中文教程文档站 - 应用逻辑
   JS动态数据插入、搜索、分类筛选、工具详情
   移动端APP式导航：底部Tab栏 + 视图切换
   ============================================================ */

// 分类配置：图标、颜色、中文描述
const CATEGORY_CONFIG = {
    '信息收集': { icon: 'fa-satellite-dish', color: 'blue', desc: '目标侦察、域名枚举、信息搜集' },
    '漏洞分析': { icon: 'fa-bug', color: 'red', desc: '漏洞扫描、安全评估' },
    'Web应用分析': { icon: 'fa-globe', color: 'cyan', desc: 'Web渗透测试与漏洞利用' },
    '数据库评估': { icon: 'fa-database', color: 'orange', desc: '数据库扫描与审计' },
    '密码攻击': { icon: 'fa-key', color: 'pink', desc: '密码破解与哈希攻击' },
    '无线攻击': { icon: 'fa-wifi', color: 'green', desc: 'WiFi/蓝牙/无线电攻击' },
    '逆向工程': { icon: 'fa-code', color: 'purple', desc: '反编译、调试与二进制分析' },
    '取证工具': { icon: 'fa-magnifying-glass', color: 'cyan', desc: '数字取证与磁盘分析' },
    '嗅探与欺骗': { icon: 'fa-network-wired', color: 'orange', desc: '网络嗅探与中间人攻击' },
    '后渗透攻击': { icon: 'fa-terminal', color: 'red', desc: '权限维持、提权与内网渗透' },
    '社会工程学': { icon: 'fa-user-secret', color: 'pink', desc: '钓鱼与社会工程攻击' },
    '压力测试': { icon: 'fa-bolt', color: 'orange', desc: 'DoS/DDoS压力测试' },
    '报告工具': { icon: 'fa-file-alt', color: 'blue', desc: '渗透测试报告与协作' },
    '硬件工具': { icon: 'fa-microchip', color: 'green', desc: '硬件安全与射频工具' },
    '云安全': { icon: 'fa-cloud', color: 'cyan', desc: '云环境安全评估' },
    '其他工具': { icon: 'fa-toolbox', color: 'muted', desc: '实用工具与辅助程序' },
};

let currentCategory = 'all';
let currentSearch = '';
let currentTab = 'home';

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    renderCategoryNav();
    renderMobileCategories();
    showAll();
    updateTotalCount();
});

// ===== 返回顶部按钮 =====
window.addEventListener('scroll', function() {
    const btn = document.getElementById('backTop');
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
});

// ===== 移动端底部Tab导航 =====
function mobileSwitchTab(tab) {
    currentTab = tab;

    // 切换视图显示
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab).classList.add('active');

    // 更新Tab高亮
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    const tabItems = document.querySelectorAll('.tab-item');
    if (tab === 'home' && tabItems[0]) tabItems[0].classList.add('active');
    else if (tab === 'categories' && tabItems[1]) tabItems[1].classList.add('active');
    else if (tab === 'about' && tabItems[2]) tabItems[2].classList.add('active');

    // 回到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 如果切换到关于页，渲染关于内容
    if (tab === 'about') {
        renderAboutContent();
    }

    // 如果切换到首页，清空搜索
    if (tab === 'home' && currentSearch) {
        currentSearch = '';
        document.getElementById('searchInput').value = '';
        showAll();
    }
}

// ===== 渲染移动端分类网格 =====
function renderMobileCategories() {
    const grid = document.getElementById('mobileCategoryGrid');
    if (!grid) return;

    const categories = {};
    TOOLS.forEach(t => {
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category]++;
    });

    let html = '';
    // 添加"全部工具"卡片
    html += `
        <div class="mobile-cat-card" onclick="mobileCategoryClick('all')">
            <div class="cat-icon-box bg-cyan">
                <i class="fas fa-th-large"></i>
            </div>
            <div class="cat-info">
                <div class="cat-name">全部工具</div>
                <div class="cat-count">${TOOLS.length} 个工具</div>
            </div>
        </div>
    `;

    Object.keys(categories).sort().forEach(cat => {
        const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他工具'];
        html += `
            <div class="mobile-cat-card" onclick="mobileCategoryClick('${cat}')">
                <div class="cat-icon-box bg-${cfg.color}">
                    <i class="fas ${cfg.icon}"></i>
                </div>
                <div class="cat-info">
                    <div class="cat-name">${cat}</div>
                    <div class="cat-count">${categories[cat]} 个工具</div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// ===== 移动端点击分类 =====
function mobileCategoryClick(cat) {
    // 切换到首页视图
    mobileSwitchTab('home');
    // 短暂延迟后执行筛选，确保视图已切换
    setTimeout(function() {
        if (cat === 'all') {
            showAll();
        } else {
            filterByCategory(cat);
        }
    }, 50);
}

// ===== 渲染关于页内容（移动端） =====
function renderAboutContent() {
    const container = document.getElementById('aboutContent');
    if (!container) return;
    container.innerHTML = `
        <div class="hero-section" style="margin:1rem">
            <h1><i class="fas fa-info-circle text-info"></i> 关于本站</h1>
            <p>Kali Linux 全部工具中文使用教程文档</p>
        </div>
        <div style="padding:0 1rem">
            <div class="alert-custom">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>免责声明：</strong>本站内容仅供安全研究、教学学习和合法授权的渗透测试使用。请勿将工具用于任何非法用途，遵守当地法律法规。
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-book"></i> 项目说明</h4>
                <p>本站收录了 Kali Linux 官方工具库中的全部安全工具，并为每个工具编写了中文使用教程。官方文档为英文，本站将其翻译并整理为通俗易懂的中文教程，方便中文用户学习和使用。</p>
                <ul>
                    <li><strong>数据来源：</strong>Kali Linux 官方工具文档 <a href="https://www.kali.org/tools/" target="_blank" style="color:var(--kali-cyan)">kali.org/tools</a></li>
                    <li><strong>工具总数：</strong>${TOOLS.length} 个工具</li>
                    <li><strong>分类体系：</strong>按功能用途分为 ${Object.keys(CATEGORY_CONFIG).length} 个大类</li>
                    <li><strong>技术栈：</strong>HTML5 + Bootstrap 5 + Font Awesome + 原生 JavaScript</li>
                    <li><strong>特性：</strong>全站响应式布局、JS动态数据插入、实时搜索、分类筛选</li>
                </ul>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-search"></i> 使用方法</h4>
                <ul>
                    <li>使用顶部搜索框可按工具名称或功能关键词搜索</li>
                    <li>点击底部"分类"Tab可按类别浏览工具</li>
                    <li>点击工具卡片查看详细中文教程、全部命令和使用方法</li>
                    <li>详情页点击右上角 × 按钮关闭返回</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== 渲染分类导航（桌面侧边栏）=====
function renderCategoryNav() {
    const nav = document.getElementById('categoryNav');
    const categories = {};
    TOOLS.forEach(t => {
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category]++;
    });

    let html = '';
    Object.keys(categories).sort().forEach(cat => {
        const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他工具'];
        html += `<a class="sidebar-link" onclick="filterByCategory('${cat}')">
            <i class="fas ${cfg.icon}"></i> ${cat}
            <span class="sidebar-badge">${categories[cat]}</span>
        </a>`;
    });
    nav.innerHTML = html;
}

// ===== 更新总数 =====
function updateTotalCount() {
    document.getElementById('totalCount').textContent = TOOLS.length;
}

// ===== 显示全部 =====
function showAll() {
    currentCategory = 'all';
    currentSearch = '';
    document.getElementById('searchInput').value = '';
    setActiveNav('all');
    renderHero();
    renderTools(TOOLS);
}

// ===== 显示关于（桌面端侧边栏点击）=====
function showAbout() {
    // 桌面端：直接在 contentArea 显示
    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
        mobileSwitchTab('about');
        return;
    }
    const content = document.getElementById('contentArea');
    content.innerHTML = `
        <div class="hero-section">
            <h1><i class="fas fa-info-circle text-info"></i> 关于本站</h1>
            <p>Kali Linux 全部工具中文使用教程文档</p>
        </div>
        <div class="alert-custom">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>免责声明：</strong>本站内容仅供安全研究、教学学习和合法授权的渗透测试使用。请勿将工具用于任何非法用途，遵守当地法律法规。
        </div>
        <div class="detail-section">
            <h4><i class="fas fa-book"></i> 项目说明</h4>
            <p>本站收录了 Kali Linux 官方工具库中的全部安全工具，并为每个工具编写了中文使用教程。官方文档为英文，本站将其翻译并整理为通俗易懂的中文教程，方便中文用户学习和使用。</p>
            <ul>
                <li><strong>数据来源：</strong>Kali Linux 官方工具文档 <a href="https://www.kali.org/tools/" target="_blank" style="color:var(--kali-cyan)">kali.org/tools</a></li>
                <li><strong>工具总数：</strong>${TOOLS.length} 个工具</li>
                <li><strong>分类体系：</strong>按功能用途分为 ${Object.keys(CATEGORY_CONFIG).length} 个大类</li>
                <li><strong>技术栈：</strong>HTML5 + Bootstrap 5 + Font Awesome + 原生 JavaScript</li>
                <li><strong>特性：</strong>全站响应式布局、JS动态数据插入、实时搜索、分类筛选</li>
            </ul>
        </div>
        <div class="detail-section">
            <h4><i class="fas fa-search"></i> 使用方法</h4>
            <ul>
                <li>使用顶部搜索框可按工具名称或功能关键词搜索</li>
                <li>点击左侧分类可按类别浏览工具</li>
                <li>点击工具卡片查看详细中文教程、全部命令和使用方法</li>
                <li>支持移动端响应式访问</li>
            </ul>
        </div>
    `;
}

// ===== 渲染 Hero 统计区 =====
function renderHero() {
    const cats = {};
    let totalCmds = 0;
    TOOLS.forEach(t => {
        cats[t.category] = (cats[t.category]||0) + 1;
        totalCmds += (t.commands ? t.commands.length : 0);
    });
    const catCount = Object.keys(cats).length;

    document.getElementById('contentArea').innerHTML = `
        <div class="hero-section">
            <h1><i class="fas fa-dragon" style="color:var(--kali-cyan)"></i> Kali Linux 工具中文教程</h1>
            <p>收录全部 ${TOOLS.length} 个安全工具的中文使用教程 | 覆盖 ${catCount} 个分类 | ${totalCmds} 条详细命令 | 仅供安全研究与合法测试</p>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-num" style="color:var(--kali-cyan)">${TOOLS.length}</div>
                    <div class="stat-label">工具总数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num" style="color:var(--kali-blue)">${catCount}</div>
                    <div class="stat-label">工具分类</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num" style="color:var(--kali-green)">${totalCmds}</div>
                    <div class="stat-label">详细命令数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num" style="color:var(--kali-purple)">100%</div>
                    <div class="stat-label">中文教程</div>
                </div>
            </div>
        </div>
        <div id="toolsContainer"></div>
    `;
}

// ===== 按分类筛选 =====
function filterByCategory(cat) {
    currentCategory = cat;
    currentSearch = '';
    document.getElementById('searchInput').value = '';
    setActiveNav(cat);

    // 移动端：确保在首页视图
    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
        mobileSwitchTab('home');
    }

    const cfg = CATEGORY_CONFIG[cat] || { icon: 'fa-toolbox', color: 'blue', desc: '' };
    const filtered = TOOLS.filter(t => t.category === cat);

    const content = document.getElementById('contentArea');
    content.innerHTML = `
        <div class="category-header">
            <div class="cat-icon bg-${cfg.color}">
                <i class="fas ${cfg.icon}"></i>
            </div>
            <div>
                <h2>${cat}</h2>
                <div class="cat-desc">${cfg.desc} · 共 ${filtered.length} 个工具</div>
            </div>
        </div>
        <div class="alert-custom">
            <i class="fas fa-shield-alt"></i>
            <strong>安全提示：</strong>以下工具仅供安全研究和合法授权测试使用，请遵守相关法律法规。
        </div>
        <div id="toolsContainer"></div>
    `;
    renderTools(filtered);
}

// ===== 搜索 =====
function handleSearch(val) {
    currentSearch = val.trim().toLowerCase();
    if (!currentSearch) {
        if (currentCategory === 'all') showAll();
        else filterByCategory(currentCategory);
        return;
    }
    setActiveNav('search');

    // 移动端：确保在首页视图
    const isMobile = window.innerWidth <= 991;
    if (isMobile && currentTab !== 'home') {
        mobileSwitchTab('home');
    }

    const results = TOOLS.filter(t => {
        return t.name.toLowerCase().includes(currentSearch) ||
               (t.cnName && t.cnName.includes(currentSearch)) ||
               (t.description && t.description.toLowerCase().includes(currentSearch)) ||
               (t.description && t.description.includes(val.trim())) ||
               (t.category && t.category.includes(val.trim()));
    });

    const content = document.getElementById('contentArea');
    content.innerHTML = `
        <div class="category-header">
            <div class="cat-icon bg-cyan">
                <i class="fas fa-search"></i>
            </div>
            <div>
                <h2>搜索结果</h2>
                <div class="cat-desc">关键词「${val}」· 找到 ${results.length} 个工具</div>
            </div>
        </div>
        <div id="toolsContainer"></div>
    `;
    renderTools(results);
}

// ===== 渲染工具列表 =====
function renderTools(list) {
    const container = document.getElementById('toolsContainer');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>未找到匹配的工具</p>
            </div>
        `;
        return;
    }

    let html = '<div class="tools-grid">';
    list.forEach((tool) => {
        const cfg = CATEGORY_CONFIG[tool.category] || { color: 'blue' };
        const iconClass = tool.icon || cfg.icon || 'fa-toolbox';
        const cardAccent = getAccentColor(cfg.color);
        const toolIdx = TOOLS.indexOf(tool);
        html += `
            <div class="tool-card" style="--card-accent: ${cardAccent}" onclick="showToolDetail(${toolIdx})">
                <div class="tool-card-head">
                    <div class="tool-icon bg-${cfg.color}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div style="min-width:0;flex:1">
                        <h3>${tool.name}</h3>
                        ${tool.cnName ? `<div class="tool-cn">${tool.cnName}</div>` : ''}
                    </div>
                </div>
                <div class="tool-desc">${tool.description || ''}</div>
                <div class="tool-tags">
                    <span class="tool-tag"><i class="fas ${cfg.icon}" style="font-size:0.6rem"></i> ${tool.category}</span>
                    ${tool.commands && tool.commands.length ? `<span class="tool-tag"><i class="fas fa-terminal" style="font-size:0.6rem"></i> ${tool.commands.length} 条命令</span>` : ''}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function getAccentColor(colorName) {
    const map = {
        blue: '#367bf0', cyan: '#2dd4bf', purple: '#a855f7',
        green: '#3fb950', red: '#f85149', orange: '#d29922',
        pink: '#ec4899', muted: '#8b949e'
    };
    return map[colorName] || '#367bf0';
}

// ===== 工具详情页（直接显示/隐藏，不使用路由）=====
function showToolDetail(idx) {
    const tool = TOOLS[idx];
    if (!tool) return;
    const cfg = CATEGORY_CONFIG[tool.category] || { icon: 'fa-toolbox', color: 'blue', desc: '' };
    const iconClass = tool.icon || cfg.icon;

    let commandsHtml = '';
    if (tool.commands && tool.commands.length) {
        commandsHtml = `<div class="detail-section"><h4><i class="fas fa-terminal"></i> 全部命令详解 <span class="cmd-count-badge">${tool.commands.length} 条</span></h4>`;
        tool.commands.forEach((c, i) => {
            commandsHtml += `
                <div class="cmd-block">
                    <div class="cmd-num">${i + 1}</div>
                    <div style="flex:1">
                        <code><span class="cmd-prefix">$ </span>${c.cmd}</code>
                        <div class="cmd-desc">${c.desc}</div>
                    </div>
                </div>
            `;
        });
        commandsHtml += '</div>';
    }

    let tutorialHtml = '';
    if (tool.tutorial) {
        tutorialHtml = `<div class="detail-section"><h4><i class="fas fa-graduation-cap"></i> 使用教程</h4><div>${tool.tutorial}</div></div>`;
    }

    let featuresHtml = '';
    if (tool.features && tool.features.length) {
        featuresHtml = '<div class="detail-section"><h4><i class="fas fa-star"></i> 主要功能</h4><ul>';
        tool.features.forEach(f => { featuresHtml += `<li>${f}</li>`; });
        featuresHtml += '</ul></div>';
    }

    let tipsHtml = '';
    if (tool.tips) {
        tipsHtml = `<div class="detail-section"><h4><i class="fas fa-lightbulb"></i> 使用技巧</h4><div>${tool.tips}</div></div>`;
    }

    let installHtml = '';
    if (tool.install) {
        installHtml = `<div class="detail-section"><h4><i class="fas fa-download"></i> 安装方式</h4><div class="cmd-block"><code><span class="cmd-prefix">$ </span>${tool.install}</code></div></div>`;
    }

    const detailPage = document.getElementById('toolDetailPage');
    detailPage.innerHTML = `
        <div class="detail-close-bar">
            <a class="detail-close-btn" onclick="closeToolDetail()" title="关闭">
                <i class="fas fa-times"></i>
            </a>
        </div>
        <div class="detail-container">
            <div class="detail-head">
                <div class="tool-icon-lg bg-${cfg.color}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div style="flex:1;min-width:0">
                    <h1>${tool.name}</h1>
                    <div class="detail-cn">${tool.cnName || ''} · <span class="tool-tag">${tool.category}</span></div>
                </div>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> 工具简介</h4>
                    <p>${tool.description || ''}</p>
                </div>
                ${featuresHtml}
                ${tutorialHtml}
                ${commandsHtml}
                ${tipsHtml}
                ${installHtml}
                <div class="detail-section">
                    <a class="ext-link" href="${tool.url || 'https://www.kali.org/tools/'}" target="_blank">
                        <i class="fas fa-external-link-alt"></i> 查看官方文档
                    </a>
                </div>
            </div>
        </div>
    `;

    // 直接显示详情页（非路由方式）
    detailPage.classList.add('active');
    document.body.style.overflow = 'hidden';
    detailPage.scrollTop = 0;
}

// ===== 关闭详情页（直接隐藏，非路由返回）=====
function closeToolDetail() {
    document.getElementById('toolDetailPage').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 导航激活状态 =====
function setActiveNav(key) {
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    if (key === 'all') {
        const links = document.querySelectorAll('.sidebar-link');
        if (links[0]) links[0].classList.add('active');
    }
}

// ESC 关闭详情页
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const detailPage = document.getElementById('toolDetailPage');
        if (detailPage.classList.contains('active')) {
            closeToolDetail();
        }
    }
});
