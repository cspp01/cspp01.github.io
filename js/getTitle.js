;(function(){
    var GetTitle=function(cus,thi){
        this.def={//默认属性
            'title':'block',//是否显示标题（block|none(默认)）
            'article':'',//要获取标题列表的内容区域节点
            'font':{
                'size':'15px',
                'color':'#666',
                'marginTB':'15px',
                'paddingLStep':'30',
                'scrollColor':'#f38c7b'//滚动到位置的标题颜色（#fff(默认)）
            },
            'hBef':'on',
            'hBefStyle':{
                'fillet':'50%',
                'width':'5px',
                'height':'5px',
                'color':['#4045FC','#ecada2','#a5e6a7','#b958fc','#59fcae']
            },
            'speed':200,
            'warehouse':{
                'bgcolor':'#fff',
                'width':'250px',
                'borderWidth':'0px',
                'borderStyle':'solid',
                'borderColor':'#999',
                'padding':'10px',
                'fillet':'5px',
                'top':'10px'
            },
            'startDisplay':'block',
            'fixedDistance':'1050px'
        };
        this.merge=this.__merge({},this.def,cus);
        this.__warehouse=thi;//要存放的标题仓库节点
        this.__styleDiv=null;//设置样式的div
        this.__content= this.merge.article;//内容区域节点
        this.__hs=null;//所有__warehouse中的标题节点
        this.__cHs=[];//所有文章中的标题节点
        this.__cHsDistance=[];//所有文章中的标题节点离顶端的距离
        this.__hierarchy=[];//层级
        this.__maxScroll=document.documentElement.offsetHeight-document.documentElement.clientHeight;//最大滚动距离
    };
    GetTitle.prototype={
        //初始化
        '__init':function(){
            this.__getH();//内容初始化
            this.__setHStyle();//层级初始化
            this.__setClick(this);//点击事件初始化
            this.__setScrollEven(this);//滚动事件初始化
            this.__setStyle();//样式初始化
            //判断内容区域高度和可是区域高度
            if(this.__maxScroll<=0){
                for(var i=0;i<this.__hs.length;i++){
                    this.__hs[i].style.display='block';
                }
            }
            this.__scroll();

        },
        //样式初始化
        '__setStyle':function(){
            for(var j=0;j<this.__hs.length;j++){
                this.__hs[j].style.color=this.merge.font.color;
                this.__hs[j].style.marginTop=this.__hs[j].style.marginBottom=this.merge.font.marginTB;
                this.__hs[j].style.fontSize=this.merge.font.size;
                if(this.merge.title=='block'){
                    this.__hs[j].style.marginTop=(j==0&&0);
                }else{
                    this.__hs[j].style.marginTop=(j==1&&0);
                }
                this.__hs[j].style.marginBottom=(j==this.__hs.length-1&&0);
            }
            if(this.merge.startDisplay=='hidden'){
                this.__styleDiv.style.display='none';
            }
            if(this.merge.hBef=='on'){
                var styleStr='#'+this.__warehouse.id+' h2:before,'+
                    '#'+this.__warehouse.id+' h3:before,'+
                    '#'+this.__warehouse.id+' h4:before,'+
                    '#'+this.__warehouse.id+' h5:before,'+
                    '#'+this.__warehouse.id+' h6:before{'+
                    ///////////////////////
                    'content:"";'+
                    'display:inline-block;'+
                    'width:'+this.merge.hBefStyle.width+';'+
                    'height:'+this.merge.hBefStyle.height+';'+
                    'vertical-align:middle;'+
                    'margin-right:10px;'+
                    '-webkit-border-radius:'+this.merge.hBefStyle.fillet+';'+
                    '-o-border-radius:'+this.merge.hBefStyle.fillet+';'+
                    '-moz-border-radius:'+this.merge.hBefStyle.fillet+';'+
                    '-ms-border-radius:'+this.merge.hBefStyle.fillet+';'+
                    'border-radius:'+this.merge.hBefStyle.fillet+';'+
                    ////////////////////////////
                    '}'+
                    '#'+this.__warehouse.id+' h2:before{'+
                    'background:'+this.merge.hBefStyle.color[0]+';'+
                    '}'+
                    '#'+this.__warehouse.id+' h3:before{'+
                    'background:'+this.merge.hBefStyle.color[1]+';'+
                    '}'+
                    '#'+this.__warehouse.id+' h4:before{'+
                    'background:lightsalmon;'+this.merge.hBefStyle.color[2]+';'+
                    '}'+
                    '#'+this.__warehouse.id+' h5:before{'+
                    'background:lightblue;'+this.merge.hBefStyle.color[3]+';'+
                    '}'+
                    '#'+this.__warehouse.id+' h6:before{'+
                    'background:gold;'+this.merge.hBefStyle.color[4]+';'+
                    '}'+
                    '#'+this.__warehouse.id+' h2,'+
                    '#'+this.__warehouse.id+' h3,'+
                    '#'+this.__warehouse.id+' h4,'+
                    '#'+this.__warehouse.id+' h5,'+
                    '#'+this.__warehouse.id+' h6{'+
                    'text-overflow:ellipsis;'+
                    'white-space:nowrap;'+
                    'overflow:hidden;'+
                    'cursor:pointer;'+
                    'font-weight:normal;'+
                    '}'+
                    '#'+this.__warehouse.id+' h2:hover,'+
                    '#'+this.__warehouse.id+' h3:hover,'+
                    '#'+this.__warehouse.id+' h4:hover,'+
                    '#'+this.__warehouse.id+' h5:hover,'+
                    '#'+this.__warehouse.id+' h6:hover{'+
                    'text-decoration:underline;'+
                    '}'+
                    '#'+this.__warehouse.id+'{' +
                    '}'+
                    '.cc-content-title{' +
                    'background-color:'+this.merge.warehouse.bgcolor+';'+
                    'width:'+this.merge.warehouse.width+';'+
                    'padding:'+this.merge.warehouse.padding+';'+
                    'border:'+this.merge.warehouse.borderWidth+' '+this.merge.warehouse.borderStyle+' '+this.merge.warehouse.borderColor+';'+
                    'top:'+this.merge.warehouse.top+';'+
                    '-webkit-border-radius:'+this.merge.warehouse.fillet+';'+
                    '-o-border-radius:'+this.merge.warehouse.fillet+';'+
                    '-moz-border-radius:'+this.merge.warehouse.fillet+';'+
                    '-ms-border-radius:'+this.merge.warehouse.fillet+';'+
                    'border-radius:'+this.merge.warehouse.fillet+';'+
                    '}'+
                    '.cc-content-title>div{' +
                    'text-align:center;'+
                    '}';
                var sty=document.head.getElementsByTagName('style')[0];
                if(sty) {
                    styleStr += sty.innerHTML;
                    sty.innerHTML=styleStr;
                }else{
                    var __styleDom=document.createElement('style');
                    __styleDom.innerHTML=styleStr;
                    document.head.appendChild(__styleDom);
                }
            }
        },
        //获取到标题
        '__getH':function(){
            //思路：先取得文章的所有内容（包括标签），然后把所有换行去掉，在在</h>后面加上换行，最后同过正则reg获得所有h的集合
            var removen=/\n/ig;//过滤掉换行
            var replacens=[/<\/h1>/ig,/<\/h2>/ig,/<\/h3>/ig,/<\/h4>/ig,/<\/h5>/ig,/<\/h6>/ig];//后面加换行
            var removeId=/(\s\w+="[^<]+"|<[^h/][^1-6h]?[^<]+>|<\/[^h][^1-6]?>)/ig;//过滤除了h标签和标题之外的所有字符串
            var reg=/<h[1-6][^<]{0,}>(.)+<\/h[1-6]>/ig;//找到h标签
            var hStr=this.__content.innerHTML.replace(removen,'');
            //</h>后加换行
            for(var i=0;i<6;i++){
                hStr=hStr.replace(replacens[i],'</h'+(i+1)+'>\n')
            }
            console.log(hStr.match(reg).join('').replace(removeId,''));
            this.__warehouse.innerHTML='<div class="cc-content-title">'+(hStr.match(reg).join('').replace(removeId,'').replace(/<h1>/i,'<div>').replace(/<\/h1>/i,'</div>'))+'</div>';
        },
        //设置标题层级
        '__setHStyle':function(){
            this.__styleDiv=this.__warehouse.getElementsByClassName('cc-content-title')[0];
            var wTags=this.__hs=this.__styleDiv.getElementsByTagName('*');
            var ifH=[true,false,false,false,false,false];//设置h1-h6的状态，初始为false,代表获取的标签没有相应的标签
            //循环所有标签拥有相应标签就把ifH的相应位置设为true
            for(var i=0;i<wTags.length;i++){
                switch(wTags[i].tagName.toLowerCase()){
                    case 'h2':ifH[1]=true;
                        break;
                    case 'h3':ifH[2]=true;
                        break;
                    case 'h4':ifH[3]=true;
                        break;
                    case 'h5':ifH[4]=true;
                        break;
                    case 'h6':ifH[5]=true;
                        break;
                }
            }
            //获取到有哪些h标签,存到数组,主要用来表示层级，数组下标0的位置存放的h标签表示第一级
            for(var j=0;j<ifH.length;j++){
                if(ifH[j]){
                    this.__hierarchy.push(j+1);
                }
            }
            var hs=this.__hierarchy;
            var tit=this.merge.title;
            wTags[0].style.display=(tit=='block'||tit=='none')?tit:'none';
            for(var b=0;b<wTags.length;b++) {
                for (var a = 0; a < hs.length; a++) {//主要用来判断属于哪个层级
                    if(wTags[b].tagName.indexOf(hs[a])!=-1){
                        wTags[b].style.marginLeft=(a-1)*this.merge.font.paddingLStep+'px';
                        wTags[b].style.display=(a>1&&'none');
                    }
                }
            }
        },
        //设置标题滚动到位置的点击事件
        '__setClick':function(__this){
            var cTags=__this.__content.getElementsByTagName('*');
            var whs=__this.__hs;
            var regH=/^h[1-6]$/i;
            //获取文章中所有标题节点
            for(var j=0;j<cTags.length;j++){
                var cTag=cTags[j].tagName;
                if(cTag.search(regH)==0){
                    __this.__cHs.push(cTags[j]);
                }
            }
            //把标题在文章中的距离存储起来，方便下次使用
            for(var a=0;a<__this.__cHs.length;a++){
                __this.__cHsDistance.push(__this.__getDisRelativeBrowser(__this.__cHs[a]));
            }
            //添加点击事件
            for(var i=0;i<whs.length;i++){
                (function(i){
                    whs[i].onclick=function(){
                        var thi=this;
                        var timer=setInterval(function(){
                            __this.__setScrollTop(__this.__cHsDistance[i],timer);
                        },20);
                    }
                })(i);
            }

        },
        //设置滚动事件
        '__setScrollEven':function(__this){
            window.onscroll=function(){
                __this.__scroll();
            }
        },
        '__scroll':function(){
            var tit=this.merge.title;
            var scrtop=document.documentElement.scrollTop||document.body.scrollTop;
            var  chsdis=this.__cHsDistance;//存储滚动距离
            var maxnum=0;
            if(scrtop>=parseInt(this.merge.fixedDistance)){
                if(this.merge.startDisplay=='hidden'){
                    this.__styleDiv.style.display='block';
                }
                this.__styleDiv.style.position='fixed';
            }else{
                if(this.merge.startDisplay=='hidden'){
                    this.__styleDiv.style.display='none';
                }
                this.__styleDiv.style.position='static';
            }
            for(var i=1;i<chsdis.length;i++){
                if(chsdis[i]>=this.__maxScroll){//假如滚动距离超过最大滚动距离那就设为最大
                    chsdis[i]=this.__maxScroll;
                }
                if(scrtop>=chsdis[i]){
                    this.__hs[i].style.display='block';//不加的话，如果滚动步长，速度太快o方法会有部分标签跳过不会执行
                    this.__hs[0].style.display=(tit=='block'||tit=='none')?tit:'none';
                    if(chsdis[maxnum]==chsdis[i]){
                        maxnum=maxnum;
                    }else{
                        maxnum=i;//获得滚动到哪个h标签的下标，当前标签
                    }
                }else{
                    var h=this.__hs[i].tagName.substring(1,2);//获得h标签的数字1-6
                    if(h!=this.__hierarchy[1]){//除了第2级标签
                        this.__hs[i].style.display='none';
                    }
                }
            }
            o(this.__hs[maxnum]);
            for(var a=0;a<chsdis.length;a++){
                this.__hs[a].style.color=this.merge.font.color;
            }
            this.__hs[maxnum].style.color=this.merge.font.scrollColor;//设置滚动标题的字体颜色
            //滚动结束查看他是否有子级或同级，有的话显示
            function o(thi){
                if(thi.tagName!='div'&&thi.nextElementSibling){
                    var ne=thi.nextElementSibling;
                    if(thi.tagName<=ne.tagName){
                        ne.style.display='block';
                        while(ne.nextElementSibling&&ne.nextElementSibling.tagName.toLowerCase==ne.tagName.toLowerCase){
                            ne.nextElementSibling.style.display='block';
                            ne=(ne.nextElementSibling&&ne.nextElementSibling);
                        }
                    }
                }
            }
        },
        //获取元素顶端的距离
        '__getDisRelativeBrowser':function(__do){
            var dis=0;
            while(__do.offsetParent){
                dis+=__do.offsetTop;
                __do=__do.offsetParent;
            }
            return dis;
        },
        //设置滚动
        '__setScrollTop':function(num,tim){
            var scrtop=document.documentElement.scrollTop||document.body.scrollTop;
            var maxScrollTop=this.__maxScroll;
            if(num>=maxScrollTop) num=maxScrollTop;
            if(num>scrtop){
                addStep(this.merge.speed);
                scrtop>=num&&clear();
            }else{
                addStep(-this.merge.speed);
                scrtop<=num&&clear();
            }
            function addStep(step){
                document.documentElement.scrollTop
                    ?document.documentElement.scrollTop=document.documentElement.scrollTop+step
                    :document.body.scrollTop=document.body.scrollTop+step;
                scrtop=document.documentElement.scrollTop||document.body.scrollTop;
            }
            function clear(){
                clearInterval(tim);
                document.documentElement.scrollTop
                    ?document.documentElement.scrollTop=num
                    :document.body.scrollTop=num;
            }
        },
        //合并默认和自定义属性
        '__merge':function(mer,def,cus){//合并，默认，自定义
            if(!cus||JSON.stringify(cus)=='{}'){
                return def;
            }
            for(var d in def){
                for(var c in cus){
                    mer[d]=(c==d?cus[c]:def[d]);
                }
            }
            return mer;
        }
    };
    Element.prototype.__newCc=function(cus){
        var titleList=new GetTitle(cus,this);
        titleList.__init();
    };
    HTMLCollection.prototype.__newCc=function(cus){
        var titleList=new GetTitle(cus,this);
        titleList.__init();
    };
})();