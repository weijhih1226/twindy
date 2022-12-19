import * as TAG from './tagName.js'
import * as STYLE from './timesliderStyle.js'

const TAG_CLASS_ADD = TAG.COLLAPSE

const tRange = 24;  // Units: hr
const tStart = tNowUTC - tRange * 60 * min2msec;
const tEnd = tNowUTC;
const tOpt = {year: 'numeric', month: '2-digit', day: '2-digit', 
              hour: '2-digit', minute: '2-digit', hour12: false};
const tStrStart = datetime2LSTStr(tStart);
const tStrEnd = datetime2LSTStr(tEnd);
var optPlay = 0;
var tSkipDefault = 10;
var tSkip = tSkipDefault;
const playSpeed = 500;

const tInt5Min = 5 * min2msec;
const tInt10Min = 10 * min2msec;
const tInt30Min = 30 * min2msec;
const tInt1Hr = 60 * min2msec;
const tInt12Hr = 720 * min2msec;

const tStart5Min = Date.parse(tStrStart.substring(0, 4) + '-' + tStrStart.substring(5, 7) + '-' + tStrStart.substring(8, 10) + 'T' + tStrStart.substring(11, 13) + ':' + tStrStart.substring(14, 15) + (parseInt(tStrStart.substring(15, 16)) < 5 ? '0' : '5') + ':00');
const tStart10Min = Date.parse(tStrStart.substring(0, 4) + '-' + tStrStart.substring(5, 7) + '-' + tStrStart.substring(8, 10) + 'T' + tStrStart.substring(11, 13) + ':' + tStrStart.substring(14, 15) + '0:00');
const tStart30Min = Date.parse(tStrStart.substring(0, 4) + '-' + tStrStart.substring(5, 7) + '-' + tStrStart.substring(8, 10) + 'T' + tStrStart.substring(11, 13) + ':' + (parseInt(tStrStart.substring(14, 15)) < 3 ? '0' : '3') + '0:00');
const tStart1Hr = Date.parse(tStrStart.substring(0, 4) + '-' + tStrStart.substring(5, 7) + '-' + tStrStart.substring(8, 10) + 'T' + tStrStart.substring(11, 13) + ':00');
const tStart12Hr = Date.parse(tStrStart.substring(0, 4) + '-' + tStrStart.substring(5, 7) + '-' + tStrStart.substring(8, 10) + 'T' + (parseInt(tStrStart.substring(11, 13)) < 12 ? '00' : '12') + ':00') - tInt12Hr;

const tAll5Min = [];
const tAll10Min = [];
const tAll30Min = [];
const tAll1Hr = [];
const tAll12Hr = [];
for (var t = tStart5Min ; t <= tEnd ; t += tInt5Min) tAll5Min.push(t);
for (var t = tStart10Min ; t <= tEnd ; t += tInt10Min) tAll10Min.push(t);
for (var t = tStart30Min ; t <= tEnd ; t += tInt30Min) tAll30Min.push(t);
for (var t = tStart1Hr ; t <= tEnd ; t += tInt1Hr) tAll1Hr.push(t);
for (var t = tStart12Hr ; t <= tEnd ; t += tInt12Hr) tAll12Hr.push(t + 480 * min2msec);

const tStartAll = tAll5Min[1];
const tEndAll = tAll5Min[tAll5Min.length - 1];
var tSelect = tEndAll;

const urlRn2 = (Y , M , D , h , m , type) => homeCWB + 'rainfall/' + (Y+'-'+M+'-'+D+'_'+h+m) + '.QZ' + type + '8.jpg';
const urlRdr2 = (Y , M , D , h , m) => homeCWB + 'radar/CV1_TW_3600_' + (Y+M+D+h+m) + '.png';
const urlLtn2 = (Y , M , D , h , m) => homeCWB + 'lightning/' + (Y+M+D+h+m) + '00_lgtl.jpg';
const urlSatVSg2 = (Y , M , D , h , m , area , px) => homeCWB + 'satellite/' + area + '_VIS_Gray_' + px + '/' + area + '_VIS_Gray_' + px + '-' + (Y+'-'+M+'-'+D+'-'+h+'-'+m) + '.jpg';
const urlSatVSt2 = (Y , M , D , h , m , area , px) => homeCWB + 'satellite/' + area + '_VIS_TRGB_' + px + '/' + area + '_VIS_TRGB_' + px + '-' + (Y+'-'+M+'-'+D+'-'+h+'-'+m) + '.jpg';
const urlSatIRc2 = (Y , M , D , h , m , area , px) => homeCWB + 'satellite/' + area + '_IR1_CR_' + px + '/' + area + '_IR1_CR_' + px + '-' + (Y+'-'+M+'-'+D+'-'+h+'-'+m) + '.jpg';
const urlSatIRe2 = (Y , M , D , h , m , area , px) => homeCWB + 'satellite/' + area + '_IR1_MB_' + px + '/' + area + '_IR1_MB_' + px + '-' + (Y+'-'+M+'-'+D+'-'+h+'-'+m) + '.jpg';
const urlTemp2 = (Y , M , D , h) => homeCWB + 'temperature/' + (Y+'-'+M+'-'+D+'_'+h) + '00.GTP8.jpg';
const urlSkt2 = (Y , M , D , h) => homeCWB2 + 'irisme_data/Weather/SKEWT/SKW___000_' + (Y+M+D+h) + '_46692.gif';

function setStyle(el , style){
    for (var property in style){
        el.style[property] = style[property];
    }
}

function createContainer(tagID , tagClass , tagClassAdd , tagParent , style){
    const container = document.querySelector(tagParent)
    const el = document.createElement('div');
    container.appendChild(el);
    el.id = tagID;
    el.className = tagClass
    el.classList.add(tagClassAdd);
    setStyle(el , style)
    return el
}

function createBody(tagID , style){
    const el = document.createElement('div');
    el.id = tagID;
    setStyle(el , style)
    el.style.width = time2BarWidth(tAll5Min[tAll5Min.length-1]);
    return el
}

function createTrackBackground(tagID , style){
    const el = document.createElement('div');
    el.id = tagID;
    setStyle(el , style)
    return el
}

function createTrack(tagID , style){
    const el = document.createElement('div');
    el.id = tagID;
    setStyle(el , style)
    return el
}

document.addEventListener('DOMContentLoaded' , function(){
    const tsCtn = createContainer(TAG.TS_CTN , TAG.TS , TAG_CLASS_ADD , TAG.MAIN , STYLE.CTN)
    const tsBody = createBody(TAG.TS_BODY , STYLE.BODY)
    const tsTrackBg = createTrackBackground(TAG.TS_TRACK_BG , STYLE.TRACK_BG)
    const tsTrack = createTrack(TAG.TS_TRACK , STYLE.TRACK)
    const content = this.querySelector('.content');
    const menu = this.querySelector('#menu');
    
    const tsPointer = this.createElement('div');
    const tsDragBtn = this.createElement('div');
    const tsAnchor = this.createElement('div');
    const tsTag = this.createElement('div');
    const tsTickTag = this.createElement('div');
    const tsCtl = this.createElement('div');
    const tsCtlplay = this.createElement('i');
    const tsCtlforward = this.createElement('i');
    const tsCtlrewind = this.createElement('i');
    const tsPointerS = tsPointer.style;
    const tsDragBtnS = tsDragBtn.style;
    const tsAnchorS = tsAnchor.style;
    const tsTagS = tsTag.style;
    const tsTickTagS = tsTickTag.style;
    const tsCtlS = tsCtl.style;

    tsCtn.appendChild(tsTrackBg);
    tsCtn.appendChild(tsCtl);
    tsTrackBg.appendChild(tsTrack);
    tsTrackBg.appendChild(tsPointer);
    tsTrack.appendChild(tsBody);
    tsPointer.appendChild(tsDragBtn);
    tsPointer.appendChild(tsAnchor);
    tsPointer.appendChild(tsTickTag);
    tsPointer.appendChild(tsTag);
    tsCtl.appendChild(tsCtlrewind);
    tsCtl.appendChild(tsCtlplay);
    tsCtl.appendChild(tsCtlforward);

    tsPointer.id = 'tsPointer';
    tsDragBtn.id = 'tsDragBtn';
    tsAnchor.id = 'tsAnchor';
    tsTag.id = 'tsTag';
    tsTickTag.id = 'tsTickTag';
    tsCtl.id = 'tsCtl';
    tsCtlplay.className = 'icofont-play-alt-1 icofont-2x';
    tsCtlforward.className = 'icofont-forward icofont-2x';
    tsCtlrewind.className = 'icofont-rewind icofont-2x';

    tsPointerS.left = time2BarWidth(tAll5Min[tAll5Min.length-1]);
    tsPointerS.height = tsTrackBg.style.height;
    tsPointerS.position = 'absolute';
    tsPointerS.display = 'flex';
    tsPointerS.justifyContent = 'center';
    tsPointerS.alignItems = 'center';

    // tsDragBtn.draggable = 'true';
    tsDragBtnS.width = tsAnchorS.width = '16px';
    tsDragBtnS.height = tsAnchorS.height = '16px';
    tsDragBtnS.position = tsAnchorS.position = 'absolute';
    tsDragBtnS.display = tsAnchorS.display = 'none';
    tsDragBtnS.background = '#197C9D' , tsAnchorS.background = '#fff';
    tsDragBtnS.borderRadius = tsAnchorS.borderRadius = '8px';
    tsDragBtnS.cursor = tsAnchorS.cursor = 'pointer';

    tsTag.innerText = tsTickTag.innerText = time2LSTStr(tEndAll);
    tsTagS.left = tsTickTagS.left = '-30px';
    tsTagS.top = '-38px' , tsTickTagS.top = '-40px';
    tsTagS.width = tsTickTagS.width = '56px';
    tsTagS.height = tsTickTagS.height = '26px';
    tsTagS.border = tsTickTagS.border = '1px solid #fff';
    tsTagS.borderRadius = tsTickTagS.borderRadius = '5px';
    tsTagS.position = tsTickTagS.position = 'absolute';
    tsTagS.background = '#197C9D' , tsTickTagS.background = '#9da8b3';
    tsTagS.color = tsTickTagS.color = '#fff';
    tsTagS.display = 'flex' , tsTickTagS.display = 'none';
    tsTagS.justifyContent = tsTickTagS.justifyContent = 'center';
    tsTagS.alignItems = tsTickTagS.alignItems = 'center';
    tsTagS.fontSize = tsTickTagS.fontSize = '14px';

    tsCtlS.right = '20px';
    tsCtlS.width = '110px';
    tsCtlS.height = '80%';
    tsCtlS.position = 'absolute';
    tsCtlS.display = 'flex';
    tsCtlS.justifyContent = 'center';
    tsCtlS.alignItems = 'center';

    tsCtl.querySelectorAll('i').forEach(icon => {
        icon.style.margin = '5px';
        // icon.style.color = '#9da8b3';
        icon.style.color = '#197C9D';
        icon.style.backgroundColor = '#fff';
        icon.style.borderRadius = '50%';
        icon.style.cursor = 'pointer';
        icon.style.pointerEvents = 'auto';
    })

    for (var t = 1 ; t < tAll1Hr.length ; t++){
        const tick = this.createElement('div');
        const tickS = tick.style;
        tsTrack.appendChild(tick);

        tickS.left = time2BarWidth(tAll1Hr[t]);
        tickS.width = '2px';
        tickS.height = '12px';
        tickS.position = 'absolute';
        tickS.display = 'flex';
        tickS.justifyContent = 'center';
        tickS.alignItems = 'center';
        tickS.cursor = 'pointer';

        if (time2LSTStr(tAll1Hr[t]).substring(0, 2) === '00' || 
            time2LSTStr(tAll1Hr[t]).substring(0, 2) === '06' || 
            time2LSTStr(tAll1Hr[t]).substring(0, 2) === '12' || 
            time2LSTStr(tAll1Hr[t]).substring(0, 2) === '18'){
            const tsTickInfo = this.createElement('span');
            tick.appendChild(tsTickInfo);
            tsTickInfo.innerText = time2LSTStr(tAll1Hr[t]);
            tsTickInfo.style.top = '-26px';
            tsTickInfo.style.position = 'absolute';
            tsTickInfo.style.pointerEvents = 'none';
            tsTickInfo.style.fontSize = '14px';
            tsTickInfo.style.textShadow = '0 0 10px #000';
            tickS.background = '#000';
        } else tickS.background = '#fff';

        if (time2LSTStr(tAll1Hr[t]).substring(0, 2) === '00'){
            const tsTickInfo = this.createElement('span');
            tick.appendChild(tsTickInfo);
            tsTickInfo.innerText = date2LSTStr(tAll1Hr[t]);
            tsTickInfo.style.top = '-46px';
            tsTickInfo.style.position = 'absolute';
            tsTickInfo.style.pointerEvents = 'none';
            tsTickInfo.style.fontSize = '14px';
            tsTickInfo.style.textShadow = '0 0 10px #000';
        }
    }

    for (var t = 1 ; t < tAll30Min.length ; t++){
        const tick = this.createElement('div');
        const tickS = tick.style;
        tsTrack.appendChild(tick);

        tickS.left = time2BarWidth(tAll30Min[t]);
        tickS.width = '1px';
        tickS.height = '10px';
        tickS.position = 'absolute';
        tickS.display = 'flex';
        tickS.justifyContent = 'center';
        tickS.alignItems = 'center';
        tickS.cursor = 'pointer';
        if (time2LSTStr(tAll30Min[t]).substring(0, 5) === '00:00' || 
            time2LSTStr(tAll30Min[t]).substring(0, 5) === '06:00' || 
            time2LSTStr(tAll30Min[t]).substring(0, 5) === '12:00' || 
            time2LSTStr(tAll30Min[t]).substring(0, 5) === '18:00'){
            tickS.background = '#000';
        } else tickS.background = '#fff';
    }

    for (var t = 1 ; t < tAll10Min.length ; t++){
        const time = tAll10Min[t];
        const tick = this.createElement('div');
        const tickS = tick.style;
        tick.className = 'tick';
        tsTrack.appendChild(tick);

        tickS.left = time2BarWidth(time);
        tickS.width = '1px';
        tickS.height = '6px';
        tickS.position = 'absolute';
        tickS.display = 'flex';
        tickS.justifyContent = 'center';
        tickS.alignItems = 'center';
        tickS.cursor = 'pointer';
        if (time2LSTStr(tAll10Min[t]).substring(0, 5) === '00:00' || 
            time2LSTStr(tAll10Min[t]).substring(0, 5) === '06:00' || 
            time2LSTStr(tAll10Min[t]).substring(0, 5) === '12:00' || 
            time2LSTStr(tAll10Min[t]).substring(0, 5) === '18:00'){
            tickS.background = '#000';
        } else tickS.background = '#fff';

        tick.addEventListener('mouseover' , function(){
            this.appendChild(tsTickTag)
            tsTickTag.innerText = time2LSTStr(time);
            tsTickTagS.display = 'flex';
        });
        tick.addEventListener('mouseleave' , function(){
            tsTickTagS.display = 'none';
        });
    }

    function eventMouse(e){
        tSelect = click2NearestTime(e , this);
        display(tSelect);
    }
    function eventRewind(){
        tSelect = rewind(tSelect , tSkip);
        display(tSelect);
    }
    function eventForward(){
        tSelect = forward(tSelect , tSkip);
        display(tSelect);
    }
    function eventPlay(spd){
        if (optPlay === 1){
            tSelect = forward(tSelect , tSkip);
            display(tSelect);
            setTimeout(() => {
                eventPlay(spd);
            } , spd);
        };
    }

    function switchPlayPause(){
        switch (optPlay){
            case 0:
                optPlay = 1;
                tsCtl.querySelector('.icofont-play-alt-1').className = 'icofont-pause icofont-2x';
                eventPlay(playSpeed);
                break;
            case 1:
                optPlay = 0;
                tsCtl.querySelector('.icofont-pause').className = 'icofont-play-alt-1 icofont-2x';
                break;
        };
    }

    function eventKey(e){
        e.preventDefault();
        if (e.ctrlKey && e.shiftKey) tSkip = 60;
        else if (!e.ctrlKey && e.shiftKey) tSkip = 30;
        else if (e.ctrlKey && !e.shiftKey) tSkip = 5;
        else tSkip = tSkipDefault;

        switch (e.keyCode){
            case 32:
                switchPlayPause();
                break;
            case 37:
                eventRewind();
                break;
            case 39:
                eventForward();
                break;
        }
    }
    function display(t){
        displayTimeslider(t);
        displayContent(t);
    }

    function displayTimeslider(tSelect){
        tsBody.style.width = time2BarWidth(tSelect);
        tsPointerS.left = time2BarWidth(tSelect);
        tsTag.innerText = time2LSTStr(tSelect);
    }

    function displayContent(tSelect){
        const t5Min = findNewest(tSelect , tAll5Min);
        const t10Min = findNewest(tSelect , tAll10Min);
        const t30Min = findNewest(tSelect , tAll30Min);
        const t1Hr = findNewest(tSelect , tAll1Hr);
        const t12Hr = findNewest(tSelect , tAll12Hr);
        
        const tStr5Min = datetime2LSTStr(t5Min);
        const tStr10Min = datetime2LSTStr(t10Min);
        const tStr30Min = datetime2LSTStr(t30Min);
        const tStr1Hr = datetime2LSTStr(t1Hr);
        const tStr12Hr = datetime2UTCStr(t12Hr);

        const tDic5Min = timeDic(tStr5Min);
        const tDic10Min = timeDic(tStr10Min);
        const tDic30Min = timeDic(tStr30Min);
        const tDic1Hr = timeDic(tStr1Hr);
        const tDic12Hr = timeDic(tStr12Hr);

        rain.querySelector('.time').innerText = tStr30Min;
        radar.querySelector('.time').innerText = tStr10Min;
        lgtn.querySelector('.time').innerText = tStr5Min;
        satvsg.querySelector('.time').innerText = tStr10Min;
        satvst.querySelector('.time').innerText = tStr10Min;
        satirc.querySelector('.time').innerText = tStr10Min;
        satire.querySelector('.time').innerText = tStr10Min;
        temp.querySelector('.time').innerText = tStr1Hr;
        skt.querySelector('.time').innerText = tStr12Hr;
        
        rain.querySelector('img').src = urlRn2(tDic30Min.Y , tDic30Min.M , tDic30Min.D , tDic30Min.h , tDic30Min.m , tagRn);
        radar.querySelector('img').src = urlRdr2(tDic10Min.Y , tDic10Min.M , tDic10Min.D , tDic10Min.h , tDic10Min.m);
        lgtn.querySelector('img').src = urlLtn2(tDic5Min.Y , tDic5Min.M , tDic5Min.D , tDic5Min.h , tDic5Min.m);
        satvsg.querySelector('img').src = urlSatVSg2(tDic10Min.Y , tDic10Min.M , tDic10Min.D , tDic10Min.h , tDic10Min.m , tagSatArea , tagSatVSgPx);
        satvst.querySelector('img').src = urlSatVSt2(tDic10Min.Y , tDic10Min.M , tDic10Min.D , tDic10Min.h , tDic10Min.m , tagSatArea , tagSatVStPx);
        satirc.querySelector('img').src = urlSatIRc2(tDic10Min.Y , tDic10Min.M , tDic10Min.D , tDic10Min.h , tDic10Min.m , tagSatArea , tagSatIRPx);
        satire.querySelector('img').src = urlSatIRe2(tDic10Min.Y , tDic10Min.M , tDic10Min.D , tDic10Min.h , tDic10Min.m , tagSatArea , tagSatIRPx);
        temp.querySelector('img').src = urlTemp2(tDic1Hr.Y , tDic1Hr.M , tDic1Hr.D , tDic1Hr.h);
        skt.querySelector('img').src = urlSkt2(tDic12Hr.Y.substring(2, 4) , tDic12Hr.M , tDic12Hr.D , tDic12Hr.h);
    }

    const onTicks = (eventType, eventHandler) => on(tsTrack , 'div', eventType, '.tick', eventHandler);

    tsTrack.addEventListener('mousedown' , eventMouse);
    tsCtlrewind.addEventListener('click' , eventRewind);
    tsCtlforward.addEventListener('click' , eventForward);
    tsCtlplay.addEventListener('click' , switchPlayPause);
    this.addEventListener('keydown' , eventKey , false);
    this.addEventListener('keyup' , () => tSkip = tSkipDefault , false);

    tsPointer.addEventListener('mouseover' , () => {
        tsDragBtnS.display = 'flex';
    });
    tsPointer.addEventListener('mouseleave' , () => {
        tsDragBtnS.display = 'none';
    });
    onTicks('mouseover', e => {
        e.target.appendChild(tsAnchor);
        tsAnchorS.display = 'flex';
    })
    onTicks('mouseleave', () => {
        tsAnchorS.display = 'none';
    })
});

function date2LSTStr(t){
    return new Date(t).toLocaleString('zh-TW', tOpt).substring(0, 10);
}

function time2LSTStr(t){
    var tStr = new Date(t).toLocaleString('zh-TW', tOpt).substring(11, 16);
    return (tStr.substring(0, 2) === '24' ? '00' : tStr.substring(0, 2)) + tStr.substring(2, 5);
}

function datetime2LSTStr(t){
    var tStr = new Date(t).toLocaleString('zh-TW', tOpt).substring(0, 16);
    return tStr.substring(11, 13) === '24' ? (tStr.substring(0, 11) + '00' + tStr.substring(13, 16)) : tStr;
}

function datetime2UTCStr(t){
    var tStr = new Date(t).toISOString().substring(0, 13);
    return tStr.substring(0, 4) + '/' + tStr.substring(5, 7) + '/' + tStr.substring(8, 10) + ' ' + tStr.substring(11, 13) + 'Z';
}

function timeDic(s){
    return {Y: s.substring(0, 4), M: s.substring(5, 7), D: s.substring(8, 10), 
            h: s.substring(11, 13), m: s.substring(14, 16)};
}

function findNewest(tSelect , tAll){
    var tNewest;
    for (const t of tAll){
        if (tSelect >= t) tNewest = t;
        else return tNewest;
    };
    return tNewest;
}

function time2BarWidth(t){
    return (t - tStart) / (tEnd - tStart) * 100 + '%';
}

function rewind(t , int){
    return (t - int * min2msec < tStart) ? tEndAll : t - int * min2msec;
}

function forward(t , int){
    return (t + int * min2msec > tEnd) ? tStartAll : t + int * min2msec;
}

function click2Time(e , track){
    return tStart + (tEnd - tStart) * (e.clientX - track.getBoundingClientRect().left) / track.clientWidth;
}

function click2NearestTime(e , track){
    var t = click2Time(e , track);
    var tAbs = [];
    tAll5Min.forEach(t5Min => tAbs.push(Math.abs(t - t5Min)));
    var tMin = Math.min(...tAbs);
    for (var i = 0; i < tAbs.length; i++){
        if (tAbs[i] === tMin) return tAll5Min[i];
    }
}

function click2BarWidth(e , track){
    return (e.clientX - track.getBoundingClientRect().left) / track.clientWidth * 100 + '%';
}

const on = (root, selector, eventType, childSelector, eventHandler) => {
    const elements = root.querySelectorAll(selector);
    for (const element of elements) {
        element.addEventListener(eventType, eventOnElement => {
            if (eventOnElement.target.matches(childSelector)) {
                eventHandler(eventOnElement);
            }
        })
    }
}