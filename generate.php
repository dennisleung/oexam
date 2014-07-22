<?php

header("Content-type:text/html;charset=utf-8");


$num = $_GET["num"];
$range = $_GET["range"];
$type = $_GET["smf"];
$index = array();
$num_of_type = array();
$a = count($type);
//if($a == 3){ 
//	array_push($num_of_type,floor($num*0.5));//single
//	array_push($num_of_type,floor($num*0.3));//multiple
//	array_push($num_of_type,$num-floor($num*0.5)-floor($num*0.3));
//}
if($a == 2){
	array_push($num_of_type,floor($num*0.7));
	array_push($num_of_type,$num-floor($num*0.7));
}
else{
	array_push($num_of_type,$num);
}

$rangestr = "";
if($range!=0)
$rangestr =  " and `unit`='".$range."'";

$dom = new DomDocument('1.0', 'utf-8');
$pqs = $dom->createElement("pqs");
$dom->appendchild($pqs);
$aaa;

$mysqli = new mysqli("localhost","root","");
//$mysqli = new mysqli("mysql.xiangyanghuakai.cn","u103957917_test","123456");
if($mysqli){
	$mysqli->query("set names utf8");
	$typestr = "";
	for($k = 0;$k<$a;$k++){//
		if($type[$k] == 0)	$typestr = "0";
		else $typestr = "1";
		//else $typestr = "2";
		$query = "SELECT * FROM oexam.single where `qtype`='".$typestr."'".$rangestr;
		$result = ($mysqli->query($query));
		$aaa = $max = mysqli_num_rows($result);
		if($num_of_type[$k] > $max){
			$num_of_type[$k] = $max;
			for($i = 0;$i<$max;$i++){
				$index[$i] = $i;
			}
		}
		else{
			$i = 0;
			while($i<$num_of_type[$k]){
				$temp = rand(0,$max-1);
				$length = count($index);
				for($j = 0;$j<$length;$j++){
					if($temp == $index[$j])
					break;
				}
				if($j>=$length){
					array_push($index,$temp);
					$i++;
				}
			}
		}
		$i = 0;
		$n = 0;
		//echo $num_of_type[$k];
		//print_r($index);
		while($question  = $result->fetch_array()){
		//	echo "Y";
		//$i++;
		if($n>$num_of_type[$k]) break;
		for($j = 0;$j<$num_of_type[$k];$j++){
			if($index[$j]==$i)
				break;
		}
		$i++;
		if($j>=$num_of_type[$k]) continue;
		$n++;
		$pq = $dom->createElement("pq");
		$pqs->appendchild($pq);
		$q = $dom->createAttribute("question");
		$pq->appendChild($q);
		$oa = $dom->createAttribute("A");
		$pq->appendChild($oa);
		$ob = $dom->createAttribute("B");
		$pq->appendChild($ob);
		$pc = $dom->createAttribute("C");
		$pq->appendChild($pc);
		$od = $dom->createAttribute("D");
		$pq->appendChild($od);
		$answer = $dom->createAttribute("answer");
		$pq->appendChild($answer);
		$qtype = $dom->createAttribute("qtype");
		$pq->appendChild($qtype);
		$pq->setAttribute("question",$question["question"]);
		$pq->setAttribute("A",$question["A"]);
		$pq->setAttribute("B",$question["B"]);
		$pq->setAttribute("C",$question["C"]);
		$pq->setAttribute("D",$question["D"]);
		$pq->setAttribute("answer",$question["answer"]);
		$pq->setAttribute("qtype",$question["qtype"]);
		}
	}
}

$time = time();
$mysqli->close();
$dom->Save("temp/".$time.".xml");



echo "<!DOCTYPE>";
echo "<html>";
echo "<head>";
echo	"<title>Welcome to OExam!</title>";
echo	"<meta http-equiv=\"content-type\" content=\"text/html\";charset=\"UTF-8\"/>";
echo	"<meta name=\"author\" content=\"dennisleung\"/>";
echo	"<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"/>";
echo	"<link rel=\"stylesheet\" href=\"bootstrap/dist/css/bootstrap.min.css\">";
echo	"<link rel=\"stylesheet\" href=\"style.css\">";
echo 	"<link rel=\"shortcut icon\" href=\"logo.png\">";
echo	"<script src=\"bootstrap/dist/vendor/jquery.js\"></script>";
echo	"<script src=\"bootstrap/dist/js/bootstrap.min.js\"></script>";
//		echo "<script>";
//		echo "alert(".$aaa.");";
//		echo "</script>";
echo    "<script>";
echo    "var path=\"temp/".$time.".xml\";";
echo    "</script>";
echo "</head>";
echo "<body>";
echo	"<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">";
echo		"<div class=\"container\">";
echo			"<div class=\"navbar-header\">";
echo				"<a class=\"navbar-brand\" href=\"index.html\"><img src=\"logo.png\" style=\"width:40px;height:40px\">&nbsp;&nbsp;OExam</a>";
echo			"</div>";
echo		"</div>";
echo	"</div>";

echo	"<div id=\"total\">";
echo 		"<div><b id=\"qtype\"></b></div>";
echo		"<hr>";
echo		"<div class=\"question\" id=\"question\">";
echo			"<b>1、</b>";
echo		"</div>";
echo		"</br>";
echo		"<div class=\"option\" id=\"optionA\">";
echo			"<input type=\"radio\" value=\"A\" name=\"option\">"."&nbsp;";
echo			"<b>A</b>&nbsp;&nbsp;";
echo		"</div>";
echo		"<div class=\"option\" id=\"optionB\">";
echo			"<input type=\"radio\" name=\"option\" value=\"B\">&nbsp;";
echo			"<b>B</b>&nbsp;&nbsp;";
echo		"</div>";
echo		"<div class=\"option\" id=\"optionC\">";
echo			"<input type=\"radio\" name=\"option\" value=\"C\">&nbsp;";
echo			"<b>C</b>&nbsp;&nbsp;";
echo		"</div>";
echo		"<div class=\"option\" id=\"optionD\">";
echo		"<input type=\"radio\" name=\"option\" value=\"D\">&nbsp;";
echo			"<b>D</b>&nbsp;&nbsp;";
echo		"</div>";
echo		"</br>";
echo		"<ul class=\"pager\">";
echo			"<li><a href=\"#\" onclick=\"previousQ();\">Previous</a></li>&nbsp;&nbsp;";
echo			"<li><a href=\"#\" onclick=\"nextQ();\">Next</a></li>&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp&nbsp;&nbsp;&nbsp;&nbsp";
echo 		"<button class=\"btn btn-primary\" onclick=\"submitQ();\">交卷</button>";
echo 		"</ul>";
echo 		"<div class=\"progress progress-striped active\">";
echo 		"<div class=\"progress-bar progress-bar-success\" style=\"width:0%\" id=\"progress\">0/10</div>";
echo 		"</div>";
echo	"</div>";

echo	"<footer class=\"navbar-fixed-bottom\">";
echo		"<h4 class=\"text-muted\">designed & powered by DennisLeung</h4>";
echo	"</footer>";
echo	"<script src=\"javascript.js\"></script>";
echo "</body>";
echo "</html>";
















?>



