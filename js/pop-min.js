const{Popover:Popover}=bootstrap;export default{template:'<div :id="id"><slot></slot></div>',props:{content:{required:!1,default:""},id:{required:!0,default:""},title:{default:"My Popover"},trigger:{default:"click"},delay:{default:0},html:{default:!1},template:{default:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'},customClass:{default:""},html:{default:!0}},mounted(){var e=this.$props,t=document.getElementById(this.id);new Popover(t,e)}};