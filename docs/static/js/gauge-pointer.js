// 4个分段的比例和颜色，仿照图片
const arcRatios = [1, 2, 3, 6];
const arcColors = ['#4EC3C7', '#F6B04E', '#F36B8A', '#E74C3C']; // 青、橙、粉、红
const total = arcRatios.reduce((a, b) => a + b, 0);
const arcAngles = arcRatios.map(r => r * 360 / total);

// 计算每个分段的起止角度
let start = -90; // 从正上方开始
const arcDefs = arcAngles.map((angle, i) => {
  const def = { start, end: start + angle, color: arcColors[i] };
  start += angle;
  return def;
});

// 新的环形分段path生成函数
function describeRingSegment(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const rad = Math.PI / 180;
  // 外圆起止点
  const x1 = cx + rOuter * Math.cos(startAngle * rad);
  const y1 = cy + rOuter * Math.sin(startAngle * rad);
  const x2 = cx + rOuter * Math.cos(endAngle * rad);
  const y2 = cy + rOuter * Math.sin(endAngle * rad);
  // 内圆起止点
  const x3 = cx + rInner * Math.cos(endAngle * rad);
  const y3 = cy + rInner * Math.sin(endAngle * rad);
  const x4 = cx + rInner * Math.cos(startAngle * rad);
  const y4 = cy + rInner * Math.sin(startAngle * rad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z'
  ].join(' ');
}

// 每个分段的文本和marker信息
const arcInfos = [
  { text: '分段一：256 tokens (minimal)', marker: 0.1, color: '#FF5A5F', label: '256 tokens' },
  { text: '分段二：512 tokens (standard)', marker: 0.3, color: '#F39C12', label: '512 tokens' },
  { text: '分段三：1024 tokens (extended)', marker: 0.6, color: '#4A90E2', label: '1024 tokens' },
  { text: '分段四：2048 tokens (maximum)', marker: 0.9, color: '#27AE60', label: '2048 tokens' }
];

function showGaugePopup(idx, angle) {
  const popup = document.getElementById('gauge-popup');
  const content = document.getElementById('gauge-popup-content');
  const text = document.getElementById('gauge-popup-text');
  const marker = document.getElementById('gauge-popup-marker');
  const markerLabel = document.getElementById('gauge-popup-marker-label');
  if (!popup || !content || !text || !marker || !markerLabel) return;
  // 先移除可见和方向class
  content.classList.remove('left', 'right');
  popup.classList.remove('is-visible');
  // 设置内容
  text.textContent = arcInfos[idx].text;
  marker.style.left = (arcInfos[idx].marker * 100) + '%';
  marker.style.background = arcInfos[idx].color;
  marker.style.boxShadow = `0 0 8px ${arcInfos[idx].color}`;
  markerLabel.textContent = arcInfos[idx].label;
  markerLabel.style.left = (arcInfos[idx].marker * 100) + '%';
  // 判断角度，决定内容对齐
  let normAngle = angle;
  if (normAngle < 0) normAngle += 360;
  if (normAngle >= 270 || normAngle <= 90) {
    content.classList.add('right');
  } else {
    content.classList.add('left');
  }
  // 淡入
  setTimeout(() => popup.classList.add('is-visible'), 50);
}

document.addEventListener('DOMContentLoaded', function() {
  // 绘制分段圆环
  const arcGroup = document.getElementById('gauge-arcs');
  arcGroup.innerHTML = '';
  const gap = 4; // 竖直切开间隙角度
  const rOuter = 110 - 16; // 外半径
  const rInner = 110 - 36; // 内半径，宽度约20
  const middleRadius = (rOuter + rInner) / 2; // 环形中心半径

  // 计算每个分段的真实角度和中心位置
  const ratios = [1, 2, 3, 6]; // 分段比例
  const totalRatio = ratios.reduce((sum, r) => sum + r, 0); // 12
  const totalGap = gap * ratios.length; // 4个分段的gap总和
  const effectiveAngle = 360 - totalGap; // 去除gap后的有效角度
  
  let startAngle = -90 + gap/2; // 从正上方开始
  const segmentCenters = [];
  
  ratios.forEach(ratio => {
    // 该分段占用的角度（按比例）
    const segmentAngle = (ratio / totalRatio) * effectiveAngle;
    // 分段中心点
    const centerAngle = startAngle + segmentAngle/2;
    segmentCenters.push(centerAngle);
    // 下一个分段的起始位置
    startAngle += segmentAngle + gap;
  });
  
  console.log("各分段比例:", ratios);
  console.log("分段中心角度:", segmentCenters);

  // 渲染分段
  arcDefs.forEach((arc, i) => {
    const s = arc.start + gap / 2;
    const e = arc.end - gap / 2;
    if (e > s) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', describeRingSegment(110, 110, rOuter, rInner, s, e));
      path.setAttribute('fill', arc.color);
      arcGroup.appendChild(path);
    }
  });

  // 指针动画 - 使用准确计算的中心角度
  let currentIndex = 0;
  let currentAngle = segmentCenters[0]; // 当前角度
  const duration = 500; // 动画时长（毫秒）

  function animatePointer(targetAngle, startTime, startAngle, idx) {
    const pointer = document.getElementById('gauge-pointer');
    if (!pointer) return;
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    // 顺时针角度插值
    let delta = targetAngle - startAngle;
    if (delta < 0) delta += 360;
    const angle = startAngle + delta * t;
    const angleRad = angle * Math.PI / 180;
    const cx = 110;
    const cy = 110;
    const x2 = cx + middleRadius * Math.cos(angleRad);
    const y2 = cy + middleRadius * Math.sin(angleRad);
    pointer.setAttribute('x2', x2);
    pointer.setAttribute('y2', y2);
    showGaugePopup(idx, angle);
    if (t < 1) {
      requestAnimationFrame(() => animatePointer(targetAngle, startTime, startAngle, idx));
    } else {
      currentAngle = targetAngle;
    }
  }
  
  // 移动指针到指定索引位置
  function movePointerToIndex(index) {
    const pointer = document.getElementById('gauge-pointer');
    if (!pointer) return;
    
    // 记录当前索引
    currentIndex = index;
    
    // 映射规则：
    // Direct Answer -> 256 tokens (0 -> 0)
    // Short Chain-of-Thought -> 512 tokens (1 -> 1)
    // Code Generation -> 1024 tokens (2 -> 2)
    // Long Reasoning -> 2048 tokens (3 -> 3)
    
    const targetAngle = segmentCenters[index];
    const cx = 110;
    const cy = 110;
    pointer.setAttribute('x1', cx);
    pointer.setAttribute('y1', cy);
    
    // 执行动画
    animatePointer(targetAngle, performance.now(), currentAngle, index);
  }

  // 监听length-visualization组件的索引变化事件
  document.addEventListener('lengthVisualizationIndexChanged', (event) => {
    console.log('Length visualization index changed:', event.detail.index);
    
    // 直接移动到对应位置
    movePointerToIndex(event.detail.index);
  });
  
  // 当length-visualization暂停时的处理
  document.addEventListener('lengthVisualizationPaused', (event) => {
    console.log('Length visualization paused at index:', event.detail.index);
    
    // 移动指针到对应位置
    movePointerToIndex(event.detail.index);
  });
  
  // length-visualization恢复时的处理
  document.addEventListener('lengthVisualizationResumed', (event) => {
    console.log('Length visualization resumed');
    
    // 如果全局对象存在，与其同步索引
    if (window.lengthVisualization && window.lengthVisualization.currentIndex !== undefined) {
      movePointerToIndex(window.lengthVisualization.currentIndex);
    }
  });
  
  // 初始化时与length-visualization同步
  if (window.lengthVisualization) {
    // 获取当前索引
    if (window.lengthVisualization.currentIndex !== undefined) {
      movePointerToIndex(window.lengthVisualization.currentIndex);
    }
    
    // 当gauge被点击时，也暂停length-visualization并更新其索引
    const gaugeElement = document.querySelector('.gauge-container');
    if (gaugeElement) {
      gaugeElement.addEventListener('click', (e) => {
        // 通过点击位置确定要选择的分段
        // 这里可以添加更复杂的逻辑来确定哪个分段被点击
        // 为了简单起见，这里我们按顺序循环切换
        const nextIndex = (currentIndex + 1) % segmentCenters.length;
        
        // 如果lengthVisualization已初始化，也停止它并更新索引
        if (window.lengthVisualization) {
          // 停止自动播放
          if (window.lengthVisualization.stopAutoplay) {
            window.lengthVisualization.isAutoplayPaused = true;
            window.lengthVisualization.stopAutoplay();
          }
          
          // 更新length-visualization的索引
          if (window.lengthVisualization.activateMarker) {
            window.lengthVisualization.activateMarker(nextIndex);
          }
        }
      });
    }
  } else {
    // 如果length-visualization不可用，初始化到第一个位置
    movePointerToIndex(0);
  }
}); 