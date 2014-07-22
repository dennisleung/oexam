var loadXML = function (xmlFile) {

	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}
	else{
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlHttp.open("POST",xmlFile,true);
	xmlHttp.send();
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState==4 && xmlHttp.status==200){
			xmlDoc = xmlHttp.responseXML.documentElement;
			nodes = xmlDoc.getElementsByTagName('pq');
			max = nodes.length;
			showQ();
			$("#next").bind("click",nextQ());
			$("#previous").bind("click",previousQ());
		}
	}
}

var xmlDoc;
var current = 0;
var xmlHttp;
var answer = new Array();
var nodes;
var first = false;
var max;
var wrong = new Array();
var grade = 0;
//var xmlFile = "temp/test.xml";

$(document).ready(function(){
	$(document).ready(
		function(){
			width = document.body.clientWidth;
			if(width>800){
				w = width-600;
			}
			else{
				w = width-50;
				$("*").css("font-size","15px");
			}
			//alert(width);
			$("#total").css("width",w+"px");
			$("#total").css("x",parseInt((document.body.clientWidth-w)/2)+"px");
//			$(".option").click(function(){
				//alert("ggg");
//				box = $(this).children("input");
//				if(box.is(":checked"))
//					box.prop("checked",false)
//				else
//					box.prop("checked",true);
//			});
			//$("input").attr("readonly",true);
		});
	loadXML(path);
});

var showQ = function(){
	num = current+1;
	ca = cb = cc = cd = "";
	if(answer[current]){
		//alert(answer[current]);
		ta = answer[current].split("");
		for(i = 0;i<ta.length;i++){
			switch(ta[i]){
				case"A":ca = "checked";break;
				case"B":cb = "checked";break;
				case"C":cc = "checked";break;
				case"D":cd = "checked";break;
				default:break;
			}
		}
	}
	qetype = "";
	//alert(nodes[current].getAttribute("qtype"));
	//alert(typeof(nodes[current].getAttribute("qtype")));
	if(nodes[current].getAttribute("qtype")=="0"){
		$("#qtype").html("单选题");
		qetype = "radio";
	}
	else if(nodes[current].getAttribute("qtype")=="1"){
		$("#qtype").html("多选题");		
		qetype = "checkbox";
	}
	else{
		$("#qtype").html("是非题");		
	}
	//alert(qetype);
	$('#question').html("<b>"+num+"、</b>"+nodes[current].getAttribute("question"));
	$('#optionA').html("<input type=\""+qetype+"\" name=\"option\" value=\"A\" "+ca+">&nbsp;<b>A</b>&nbsp;&nbsp;"+nodes[current].getAttribute("A"));
	$('#optionB').html("<input type=\""+qetype+"\" name=\"option\" value=\"B\" "+cb+">&nbsp;<b>B</b>&nbsp;&nbsp;"+nodes[current].getAttribute("B"));
	$('#optionC').html("<input type=\""+qetype+"\" name=\"option\" value=\"C\" "+cc+">&nbsp;<b>C</b>&nbsp;&nbsp;"+nodes[current].getAttribute("C"));
	$('#optionD').html("<input type=\""+qetype+"\" name=\"option\" value=\"D\" "+cd+">&nbsp;<b>D</b>&nbsp;&nbsp;"+nodes[current].getAttribute("D"));
	//$("input").attr("disabled",true);
}

var previousQ = function(){
	check();
	if(!first){
		first = true;
		return;
	}
	current--;
	if(current>=0)
	showQ();
	else
	current++;
}

var nextQ = function(){
	check();
	if(!first) return;
	current++;
	if(current<max)
	showQ();
	else
	current--;
}

var check =function(){
	//alert((document.getElementById("aaa")).value);


	var option = document.getElementsByName("option");
	var t = "";
	for(i = 0;i<option.length;i++){
		if(option[i].checked){
			//alert(option[i].value)
			t += option[i].value;
		}
	}
	answer[current] = t;
	//alert(answer[current]);
	cc = 0;
	for(i=0;i<answer.length;i++)
		if(answer[i]!="") cc++;
	//alert(cc);
	//alert(parseInt(cc/nodes.length*100)+"%");
	$("#progress").css("width",parseInt(cc/nodes.length*100)+"%");
	$("#progress").html(cc+"/"+nodes.length);
}


var submitQ = function(){
	if(confirm("确定要结束答题，提交试卷吗？")){
		check();
		for(i = 0;i<nodes.length;i++){
			if(answer[i]==nodes[i].getAttribute("answer"))
				grade++;
			else
				wrong.push(i);
		}
	$("#total").html("<center></br></br></br></br>你总共答对了"+"<span style=\"background-color:#dff0d8;padding:0 20px;\">"+grade+"</span>"+"题！</br></br><button class=\"btn btn-default\" onclick=\"showPW();\">查看错题</button></center>");
	current = 0;
	}

}




var showPW = function(){
	$('#total').html(
 		"<div><b id=\"qtype\"></b></div>"
+		"<hr>"
+			"<div class=\"question\" id=\"question\">"
+			"<b>1、</b>"
+		"</div>"
+		"</br>"
+		"<div class=\"option\" id=\"optionA\">"
+			"<input type=\"radio\" value=\"A\" name=\"option\">&nbsp;"
+			"<b>A</b>&nbsp;&nbsp;"
+		"</div>"
+		"<div class=\"option\" id=\"optionB\">"
+			"<input type=\"radio\" name=\"option\" value=\"B\">&nbsp;"
+			"<b>B</b>&nbsp;&nbsp;"
+		"</div>"
+		"<div class=\"option\" id=\"optionC\">"
+			"<input type=\"radio\" name=\"option\" value=\"C\">&nbsp;"
+			"<b>C</b>&nbsp;&nbsp;"
+		"</div>"
+		"<div class=\"option\" id=\"optionD\">"
+		"<input type=\"radio\" name=\"option\" value=\"D\">&nbsp;"
+			"<b>D</b>&nbsp;&nbsp;"
+		"</div>"
+		"</br>"
+		"<ul class=\"pager\">"
+			"<li><a href=\"#\" onclick=\"previousW();\" id=\"previous\">Previous</a></li>&nbsp;&nbsp;"
+			"<li><a href=\"#\" onclick=\"nextW();\" id=\"next\">Next</a></li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"
+ 		"<button class=\"btn btn-primary\" onclick=\"redoQ();\" id=\"redo\">重做</button>"
+ 		"</ul>"
+		"<div id=\"info\"></div>");

showW();
}


var redoQ = function(){
	if(confirm("确定要重做该份试题吗？")){
		current = 0;
		grade = 0;
		wrong.length = 0;
		answer.length = 0;
		$('#total').html(
	 		"<div><b id=\"qtype\"></b></div>"
	+		"<hr>"
	+			"<div class=\"question\" id=\"question\">"
	+			"<b>1、</b>"
	+		"</div>"
	+		"</br>"
	+		"<div class=\"option\" id=\"optionA\">"
	+			"<input type=\"radio\" value=\"A\" name=\"option\">&nbsp;"
	+			"<b>A</b>&nbsp;&nbsp;"
	+		"</div>"
	+		"<div class=\"option\" id=\"optionB\">"
	+			"<input type=\"radio\" name=\"option\" value=\"B\">&nbsp;"
	+			"<b>B</b>&nbsp;&nbsp;"
	+		"</div>"
	+		"<div class=\"option\" id=\"optionC\">"
	+			"<input type=\"radio\" name=\"option\" value=\"C\">&nbsp;"
	+			"<b>C</b>&nbsp;&nbsp;"
	+		"</div>"
	+		"<div class=\"option\" id=\"optionD\">"
	+		"<input type=\"radio\" name=\"option\" value=\"D\">&nbsp;"
	+			"<b>D</b>&nbsp;&nbsp;"
	+		"</div>"
	+		"</br>"
	+		"<ul class=\"pager\">"
	+			"<li><a href=\"#\" onclick=\"previousQ();\">Previous</a></li>&nbsp;&nbsp;"
	+			"<li><a href=\"#\" onclick=\"nextQ();\">Next</a></li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"
	+ 		"<button class=\"btn btn-primary\" onclick=\"submitQ();\">交卷</button>"
	+ 		"</ul>"
	+ 		"<div class=\"progress progress-striped active\">"
	+	 	"<div class=\"progress-bar progress-bar-success\" style=\"width:0%\" id=\"progress\">0/10</div>"
	+ 		"</div>");
		showQ();
	//	$(".option").click(function(){
	//		box = $(this).children("input");
	//		if(box.is(":checked"))
	//			box.prop("checked",false)
	//		else
	//			box.prop("checked",true);
	//	});
	}
}



var showW = function(){
	if(nodes[wrong[current]].getAttribute("qtype")=="0"){
		$("#qtype").html("单选题");
	}
	else if(nodes[wrong[current]].getAttribute("qtype")=="1"){
		$("#qtype").html("多选题");		
	}
	else{
		$("#qtype").html("是非题");		
	}	
	$('#question').html("<b>"+(wrong[current]+1)+"、</b>"+nodes[wrong[current]].getAttribute("question"));
	$('#optionA').html("<b>A</b>&nbsp;&nbsp;"+nodes[wrong[current]].getAttribute("A"));
	$('#optionB').html("<b>B</b>&nbsp;&nbsp;"+nodes[wrong[current]].getAttribute("B"));
	$('#optionC').html("<b>C</b>&nbsp;&nbsp;"+nodes[wrong[current]].getAttribute("C"));
	$('#optionD').html("<b>D</b>&nbsp;&nbsp;"+nodes[wrong[current]].getAttribute("D"));
	$('#optionA').css("background-color","#ffffff");
	$('#optionB').css("background-color","#ffffff");
	$('#optionC').css("background-color","#ffffff");
	$('#optionD').css("background-color","#ffffff");
	ca = cb = cc = cd ="";
	ta = nodes[wrong[current]].getAttribute("answer").split("");
	for(i = 0;i<ta.length;i++){
		switch(ta[i]){
			case"A":ca = $("#optionA").css('background-color','#dff0d8');break;
			case"B":cb = $("#optionB").css('background-color','#dff0d8');break;
			case"C":cc = $("#optionC").css('background-color','#dff0d8');break;
			case"D":cd = $("#optionD").css('background-color','#dff0d8');break;
			default:break;
		}
	}
	$('#info').html("正确答案：<b style=\"color:#dff0d8\">"+nodes[wrong[current]].getAttribute("answer")+"</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你的答案：<b style=\"color:#f2dede\">"+answer[wrong[current]]+"</b>");
}

var previousW = function(){
	if(current<=0) return;
	current--;
	showW();
}

var nextW = function(){
	if(current+1>=wrong.length) return;
	current++;
	showW();
}