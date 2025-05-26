// 定义NameModel类，用于管理名字数据和相关操作
class NameModel {
    constructor() {
        // 初始化数据
        this.groups = {
            '默认组': []
        };
        this.currentGroup = '默认组';  // 当前选中的组
        this.currentName = null;      // 当前选中的名字
        this.isRollingMode = false;   // 是否为滚动模式
        this.isRolling = false;       // 是否正在滚动
        this.scrollInterval = null;   // 滚动定时器
        this.speed = 50;              // 滚动初始速度
        this.acceleration = 0.95;     // 滚动减速系数
    }

    // 获取当前组的名字列表
    get names() {
        return this.groups[this.currentGroup] || [];
    }

    // 随机选取一个名字
    pickRandomName() {
        if (this.names.length === 0) return;  // 如果列表为空则返回
        this.currentName = this.names[Math.floor(Math.random() * this.names.length)];
        this.playSound();  // 播放音效
        return this.currentName;
    }

    // 开始滚动选择名字
    startRolling() {
        if (this.names.length === 0 || this.isRolling) return;
        
        this.isRolling = true;
        this.speed = 50;
        let counter = 0;
        
        // 设置定时器实现滚动效果
        this.scrollInterval = setInterval(() => {
            this.pickRandomName();
            updateNameDisplay();
            
            counter++;
            this.speed *= this.acceleration;  // 逐渐减速
            
            // 停止条件：滚动超过30次或速度低于5
            if (counter > 30 || this.speed < 5) {
                this.stopRolling();
            }
        }, this.speed);
    }

    // 停止滚动
    stopRolling() {
        clearInterval(this.scrollInterval);
        this.isRolling = false;
    }

    // 播放点击音效
    playSound() {
        const audio = new Audio('click.wav');
        audio.play().catch(e => console.log('无法播放音效:', e));
    }

    // 导入名字列表到指定组
    importNames(text, groupName = this.currentGroup) {
        if (!this.groups[groupName]) {
            this.groups[groupName] = [];  // 如果组不存在则创建
        }
        // 分割文本并过滤空行
        this.groups[groupName] = text.split('\n')
            .filter(name => name.trim() !== '');
        this.currentGroup = groupName;
        this.saveNames();  // 保存到本地存储
        this.pickRandomName();
        updateNameDisplay();
        this.updateGroupSelector();
    }

    // 更新组选择器下拉菜单
    updateGroupSelector() {
        const select = document.getElementById('groupSelect');
        if (!select) return;
        
        select.innerHTML = '';
        // 为每个组创建option元素
        Object.keys(this.groups).forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            option.selected = group === this.currentGroup;
            select.appendChild(option);
        });
    }

    // 添加新组
    addGroup(groupName) {
        if (!groupName.trim()) return false;
        if (this.groups[groupName]) return false;  // 组已存在则返回false
        
        this.groups[groupName] = [];
        this.currentGroup = groupName;
        this.saveNames();
        return true;
    }

    // 保存数据到本地存储
    saveNames() {
        localStorage.setItem('randomNamePickerGroups', JSON.stringify({
            groups: this.groups,
            currentGroup: this.currentGroup
        }));
    }

    // 从本地存储加载数据
    loadNames() {
        const savedData = localStorage.getItem('randomNamePickerGroups');
        if (savedData) {
            const { groups, currentGroup } = JSON.parse(savedData);
            this.groups = groups;
            this.currentGroup = currentGroup;
            this.pickRandomName();
            updateNameDisplay();
            this.updateGroupSelector();
            return true;
        }
        return false;
    }
}

// 创建NameModel实例
const nameModel = new NameModel();
let isRollingMode = false;  // 全局滚动模式状态

// 获取DOM元素
const currentNameEl = document.getElementById('currentName');
const pickButton = document.getElementById('pickButton');
const modeButton = document.getElementById('modeButton');
const selectButton = document.getElementById('selectButton'); // 修改为选择名单按钮

// 初始化函数
function init() {
    // 为抽取按钮添加点击事件
    pickButton.addEventListener('click', () => {
        if (isRollingMode) {
            nameModel.startRolling();  // 滚动模式下开始滚动
        } else {
            nameModel.pickRandomName();  // 直接模式下直接选取
            updateNameDisplay();
        }
    });

    // 模式切换按钮
    modeButton.addEventListener('click', () => {
        isRollingMode = !isRollingMode;
        updateModeButton();
    });

    // 选择名单按钮点击事件 - 显示选择名单面板
    selectButton.addEventListener('click', () => {
        document.getElementById('selectPanel').style.display = 'block';
    });

    // 关闭选择名单面板
    document.getElementById('closeSelectPanel').addEventListener('click', () => {
        document.getElementById('selectPanel').style.display = 'none';
    });

    // 导入新名单按钮点击事件 - 显示导入新名单面板
    document.getElementById('showImportPanel').addEventListener('click', () => {
        document.getElementById('importPanel').style.display = 'block';
        document.getElementById('selectPanel').style.display = 'none';
    });

    // 保存新名单
    document.getElementById('saveImport').addEventListener('click', () => {
        const groupName = document.getElementById('newGroupName').value.trim();
        const names = document.getElementById('newNameList').value;
        
        if (groupName && names.trim()) {
            if (nameModel.addGroup(groupName)) {
                nameModel.importNames(names, groupName);
                document.getElementById('importPanel').style.display = 'none';
                document.getElementById('newGroupName').value = '';
                document.getElementById('newNameList').value = '';
            }
        }
    });

    // 关闭导入新名单面板
    document.getElementById('closeImportPanel').addEventListener('click', () => {
        document.getElementById('importPanel').style.display = 'none';
        document.getElementById('newGroupName').value = '';
        document.getElementById('newNameList').value = '';
    });

    // 尝试加载本地存储的名单
    if (!nameModel.loadNames()) {
        // 如果没有本地数据，加载测试数据
        nameModel.importNames("张三\n李四\n王五\n赵六\n钱七");
    }
    updateNameDisplay();
    updateModeButton();

    // 切换小组按钮事件
    document.getElementById('switchGroupButton').addEventListener('click', () => {
        const select = document.getElementById('groupSelect');
        const currentIndex = Array.from(select.options).findIndex(opt => opt.selected);
        const nextIndex = (currentIndex + 1) % select.options.length;
        select.selectedIndex = nextIndex;
        select.dispatchEvent(new Event('change'));
    });

    // 组选择器变更事件
    document.getElementById('groupSelect').addEventListener('change', (e) => {
        nameModel.currentGroup = e.target.value;
        nameModel.saveNames();  // 保存当前组选择
        nameModel.pickRandomName();
        updateNameDisplay();
        document.getElementById('selectPanel').style.display = 'none'; // 选择后关闭面板
    });
}

// 更新显示当前名字
function updateNameDisplay() {
    currentNameEl.textContent = nameModel.currentName || '点击抽取';
}

// 更新模式按钮显示
function updateModeButton() {
    const icon = modeButton.querySelector('.button-icon svg');
    const text = modeButton.querySelector('.button-text');
    
    if (isRollingMode) {
        icon.innerHTML = '<path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>';
        text.textContent = '滚动模式';
    } else {
        icon.innerHTML = '<path fill="currentColor" d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM16.34 20l-2.59-2.59-1.41 1.41 3.17 3.18 4.25-4.25-1.42-1.41L16.34 20zM14 4h2v12h-2V4z"/>';
        text.textContent = '直接模式';
    }
}

// 当DOM加载完成后启动应用
document.addEventListener('DOMContentLoaded', init);
