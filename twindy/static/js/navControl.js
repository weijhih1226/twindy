import * as TAG from './tagName.js'

const DELAY = 10;
const WIDTH = 300;

window.addEventListener('DOMContentLoaded' , function(){
    CollapseSidemenu(TAG.BTN_COLLAPSE_MENU , TAG.CTN_SIDEMENU , TAG.OBJ_COLLAPSE , WIDTH , DELAY)
})

function CollapseSidemenu(tagClickObj , tagSidemenu , tagCollapse , width , delay){
    var sidemenu = document.querySelector(tagSidemenu);
    if (sidemenu !== null) {
        sidemenu.style.right = getComputedStyle(sidemenu).right;
        document.querySelector(tagClickObj).addEventListener('click' , () => {
            var collapses = document.querySelectorAll(tagCollapse);
            collapses = Array.from(collapses)
            collapses.forEach(function(collapse){
                collapse.style.right = getComputedStyle(collapse).right
            })
            if (sidemenu.style.right === '0px') closeSidemenu(sidemenu , collapses , width , delay);
            else openSidemenu(sidemenu , collapses , width , delay);
        })
    }
}

function closeSidemenu(menu , contents , width , delay){
    if (menu.style.right === '') menu.style.right = '0px';
    if (parseInt(menu.style.right) > -width) {
        setTimeout(() => {
            menu.style.right = (parseInt(menu.style.right) - 10) + 'px';
            for (var i = 0 ; i < contents.length ; i++) {
                if (contents[i] !== null) contents[i].style.right = (parseInt(contents[i].style.right) - 10) + 'px';
            }
            closeSidemenu(menu , contents , width , delay)
        } , delay)
    }
}

function openSidemenu(menu , contents , width , delay){
    if (menu.style.right === '') menu.style.right = -width + 'px';
    if (parseInt(menu.style.right) < 0) {
        setTimeout(() => {
            menu.style.right = (parseInt(menu.style.right) + 10) + 'px';
            for (var i = 0 ; i < contents.length ; i++) {
                if (contents[i] !== null) contents[i].style.right = (parseInt(contents[i].style.right) + 10) + 'px';
            }
            openSidemenu(menu , contents , width , delay)
        } , delay)
    }
}