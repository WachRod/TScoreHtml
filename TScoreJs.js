// TScoreJS.js
// Calculating  statistical values for grading.
// Author: Wach R.  (wachr0@gmail.com)
// Office :  RMUTT, School of Physics.
// First released:  November 2018
// Second updated: 10 May 2019
// Last updated: 16 May 2019.
// Please have a happy face during code reading.
//==============================================
const MAXIMUM_NUMBER_OF_DATA = 3000;
 const DEFAULT_TOLERANCE  = 1.0e-7;

  var average, sd;
 document.getElementById("printBtn").disabled = true;
 
 function formatDate(date) {
  var options= {weekday:'long', day:'numeric', month:'long', year:'numeric',hour:'numeric',minute:'numeric'};
 return date.toLocaleDateString("en-GB", options);
}
 function openHelpWindow(){
 var helpWindow = window.open("helpTScore.html", "newWindow", "width=500,height=700");
 }
 function getData() {
 var rawScores = [];
 var temp = '';
 var IN_COMMENT = false;
 var IN_DIGIT = false;
 var point = 0;
 var line = 0;
 var n = 0;
 
    var dataFromTextArea = document.getElementById("inputRawScore").value
	if (dataFromTextArea == ''){
		document.getElementById("printBtn").disabled = true;
		alert("Please input your scores in textarea....");
		return -1;
	} else {
	 for  ( var i =0; i < dataFromTextArea.length; i++) {
		switch (dataFromTextArea[i]) {
			case '*' : IN_COMMENT = true; break;
			case '0' : case '1':  case '2': case '3': case '4' : case '5':
			case '6' : case '7':  case '8': case '9' : case '.' :
				if (!IN_COMMENT) {
					IN_DIGIT = true;
					if (dataFromTextArea[i] == '.') point += 1;
					temp = temp + dataFromTextArea[i]
					if (point > 1) {
						document.getElementById("printBtn").disabled = true;
						alert("Found any score not a number at line "+ (line+1));
						return -1;
					}
				}
				break;
			case ' ':	case '\n':
				if (dataFromTextArea[i] == '\n') 	{
					line = line +1;
					IN_COMMENT = false;
				}
				if (!(IN_COMMENT ) && IN_DIGIT)	{
					point = 0;
					if  (temp != ""  &&  temp != " ") {
						rawScores[n] = parseFloat(temp);
						temp = "";
						n=n+1;
						if ( n > (MAXIMUM_NUMBER_OF_DATA)) {
						document.getElementById("printBtn").disabled = true;
						alert ("Sorry! Your data exceed  "+(MAXIMUM_NUMBER_OF_DATA)+"\nPlease truncate your data","Error" );
						return -1;
						} // if (n >=.....

					} // if (temp != ""......)
					IN_DIGIT = false;
				}
				break;
				
			default :
				if (!IN_COMMENT )	{
				document.getElementById("printBtn").disabled = true;	
				alert("Error at line"+(line+1));
				return -1;
			}
			break;
		} //switch
      if ( i == (dataFromTextArea.length-1) && dataFromTextArea[i] != '\n'  && dataFromTextArea[i] != ' ') {   
			rawScores[n] = parseFloat(temp);
			n=n+1;
			if ( n > (MAXIMUM_NUMBER_OF_DATA)) {
						//document.getElementById("calBtn").disabled = true;
						alert ("Sorry! Your data exceed  "+(MAXIMUM_NUMBER_OF_DATA)+"\nPlease truncate your data","Error" );
				return -1;
				} // if (n >=.....
	  }
	}// for loop
		if ( n < 2) {
			document.getElementById("printBtn").disabled = true;
			alert ("At least 2 data for T score calculation.")
			return -1;
		}
	} // if dataFromTextArea ... else
return rawScores;
}

function computeTScore(array) {
var data=[], freq=[], prev;
	for (var i =0; i < array.length; i++) {
		if (array[i] !== prev) {
			data.push(array[i]);
			freq.push(1);
		} else {
			freq[freq.length-1]++;
		}
		prev = array[i];
	} // for (var i...)
var c = [];  // cumulative frequency
		freq.reduceRight(function(accumulate,currentValue,index){
				return c[index] = accumulate+currentValue;},0);
var p =[];
var p100=[];  // percentile
	for(var i = freq.length -1; i >=0; i--){
		if ( i == freq.length-1){
			p[i] = 0.5*freq[i]/array.length ;
			p100[i] = (p[i]*100).toFixed(2);
		}else {
			p[i] = ((c[i+1] + 0.5* freq[i] )/array.length);
			p100[i] = (p[i]*100).toFixed(2);
		}
			
	}	
var t = [];  // T score
var z = []; // z score
	for (var i=0;i < p.length ;i++ ){
			z[i]=	find_Z_AtKnownArea (p[i]);
			// Change  z value to T score.
			t[i] = (z[i]*10.0 +50.0).toFixed(2);
			z[i] = z[i].toFixed(3);
	}
var g = [];
			g = grading(t);
			
	return [data, freq, c, p100, z, t, g]
}
function find_Z_AtKnownArea(area){
var isAreaGreaterThanHalf = false;
var lowerLimit=0;
var newArea=0;
var deltaX;
var z=0 , sumArea=0;
var  dA;
		if ( area < 0 || area >1 ) {
			alert("An area should be between 0 and 1")
			return -1;
		}
		if (area > 0.5){
			 newArea = area - 0.5;
			 isAreaGreaterThanHalf = true;
		 } else { 
			 newArea = 0.5 - area; 
		}
		
	if (newArea >= 0.01993880583837) {
			lowerLimit = 0.05; 	sumArea = 0.01993880583837;
		}
	if (newArea >= 0.09870632568292) {
			lowerLimit = 0.25;	sumArea = 0.09870632568292;
		}	
	if (newArea >= 0.19146246127401) {
			lowerLimit = 0.5; 	sumArea = 0.19146246127401;
		}	
	if (newArea >= 0.34134474606854 ) {
			lowerLimit = 1.0; 	sumArea = 0.34134474606854;
		}	
	if (newArea >= 0.43319279873114) {
			lowerLimit = 1.5; 	sumArea = 0.43319279873114;
		}	
	if (newArea >= 0.47724986805182) {
			lowerLimit = 2; 	sumArea = 0.47724986805182;
		}
	if (newArea >= 0.48609655248650) {
			lowerLimit = 2.2; 	sumArea = 0.48609655248650;
		}
	if (newArea >= 0.48927588997832) {
			lowerLimit = 2.3; 	sumArea = 0.48927588997832;
		}
	if (newArea >= 0.49180246407540) {
			lowerLimit = 2.4; 	sumArea = 0.49180246407540;
		}
	if (newArea >= 0.49379033467422) {
			lowerLimit = 2.5; 	sumArea = 0.49379033467422;
		}	
	if (newArea >=0.49653302619696) {
			lowerLimit = 2.7; 	sumArea = 0.49653302619696;
		}	
	if (newArea >=0.49744486966957) {
			lowerLimit = 2.8; 	sumArea =0.49744486966957 ;
		}	
	if (newArea >=0.49813418669962) {
			lowerLimit = 2.9; 	sumArea =0.49813418669962 ;
		}	
	if (newArea >= 0.49865010196837) {
			lowerLimit = 3; 	sumArea = 0.49865010196837;
		}	
	if (newArea >=0.49903239678678 ) {
			lowerLimit = 3.1; 	sumArea = 0.49903239678678;
		}	
	if (newArea >= 0.49931286206208) {
			lowerLimit = 3.2; 	sumArea = 0.49931286206208;
		}	
	if (newArea >= 0.49951657585762) {
			lowerLimit = 3.3; 	sumArea = 0.49951657585762;
		}	
	z = lowerLimit;
	deltaX = 0.00001;
	while( newArea - sumArea >DEFAULT_TOLERANCE) {
		dA = (1/Math.sqrt(2*Math.PI))*0.5*deltaX*(Math.exp(-0.5*z*z) + Math.exp(-0.5*(z+deltaX)*(z+deltaX)));
		sumArea += dA;
		z += deltaX;
	}
	if (isAreaGreaterThanHalf)  return z+deltaX;
		else return -(z+deltaX);
}
function grading(t)  {
var difference, range, gradeChoice;
var g = [];

   		 difference = t[0] - t[t.length -1];
		 if (difference < 0)   difference = -difference;
		 gradeChoice = document.getElementById('gradeOption').selectedIndex;
		 if (gradeChoice < 0 ) gradeChoice = 0;
    switch ( gradeChoice)    {
    case 0 : {
				range = difference/5.0;
				for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "F";
					if (t[i] >= 50.0 -1.5*range)  g[i] = "D";
					if (t[i] >= 50.0 -1.0*range)  g[i] = "D+";
					if (t[i] >= 50.0 -0.5*range)  g[i] = "C";
					if (t[i] >= 50.0)  g[i] = "C+";
					if (t[i] >= 50.0 +0.5*range)  g[i] = "B";
					if (t[i] >= 50.0 +1.0*range)  g[i] = "B+";
					if (t[i] >= 50.0 +1.5*range)  g[i] = "A";
				}
				break;
			}
	case 1: {
			range = difference/5.0;
		    for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "F";
					if (t[i] >= 50.0 -1.5*range) g[i] = "D";
					if (t[i] >= 50.0 -0.5*range) g[i] = "C";
					if (t[i] >= 50.0 +0.5*range) g[i] = "B";
					if (t[i] >= 50.0 +1.5*range) g[i] = "A";
			}
			break;
			}
    case 2: {
			range = difference/4.0;
			for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "D";
					if (t[i] >= 50.0 -1.25*range)  g[i] = "D+";
					if (t[i] >= 50.0 -1.0*range)  g[i] = "C";
					if (t[i] >= 50.0 -0.5*range)  g[i] = "C+";
					if (t[i] >= 50.0)  g[i] = "B";
					if (t[i] >= 50.0 +0.5*range)  g[i] = "B+";
					if (t[i] >= 50.0 +1.0*range)  g[i] = "A";
				}
				break;
				}
	case 3: {
			range = difference/4.0;
			for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "D";
					if (t[i] >= 50.0 -1.0*range)  g[i] = "C";
					if (t[i] >= 50.0)  g[i] = "B";
					if (t[i] >= 50.0 +1.0*range)  g[i] = "A";
				}
				break;
			}
	case 4: {
			range =difference/3.0;
			for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "C";

				if (t[i] >= 50.0 -0.75*range)  g[i] = "C+";
					if (t[i] >= 50.0 -0.5*range)  g[i] = "B";
					if (t[i] >= 50.0)  g[i] = "B+";
					if (t[i] >= 50.0 +0.5*range)  g[i] = "A";
				}
				break;
				}
		case 5 : {
			range = difference/3.0;
			for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "C";
					if (t[i] >= 50.0 -0.5*range)  g[i] = "B";
					if (t[i] >= 50.0 +0.5*range)  g[i] = "A";
				}
				break;
				}
		case 6 : {
			range = difference/2.0;
			for(var i = 0 ; i < t.length ; i++) {
					g[ i ] = "B";
					if (t[i] >= 50.0 )  g[i] = "A";
				}
				break;
				}
	} //  end switch
	return g;
}
function countGrade(grade,frequency) {
gCount ={};
	for (var i = 0; i< grade.length; i++) {
		gCount[grade[i]] = gCount[grade[i]] ? gCount[grade[i]]+frequency[i] : frequency[i];
}
return gCount;
}
function displayTable(array) {
	var header = displayTableHeader(array);
    var tableTag = "<table id='resultTable' border=1> <tr> <th> Raw Score </th><th> Frequency</th><th> Cum Freq</th> "
	+ "<th>Percentile</th><th>z Score</th><th>T Score</th><th>Grade</th></tr>";
	
    for(var i=0; i< array[0].length; i++) {
        tableTag += "<tr>";
        for(var j=0; j< array.length; j++){
            tableTag += "<td><center>"+array[j][i]+"</center></td>";
        }
        tableTag += "</tr>";
    }
    tableTag += "</table><br/><p> End of Table</p>";

    return header.concat(tableTag);
}
function displayTableHeader(array){
today = formatDate(new Date());
var headerTag = "<p id='tableHeader' text-align='center'><font size=2>"+"Date-Time :"+today+ "</font>" ;
	var average2 = average.toFixed(2);
	var sd2		= sd.toFixed(2);
var dataSummation = "<table><tr><td>Average Score = "+ average2+"</td><td></td><td>"+"Standard Deviation = "+ sd2
 +"</td></tr></table></p>";
 var gradeSummary = "<p><font size=2>";
	 gradeCount = countGrade(array[6],array[1]);
	for (var element in gradeCount){
		gradeSummary += element + " = "+ gradeCount[element] + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
	}
	gradeSummary += "</font></p>";
	dataSummation = dataSummation.concat(gradeSummary);
	return headerTag.concat(dataSummation);
}
function printResult()
{
 
   outputWin= window.open("");
   outputWin.document.write("<center>Normalized T Score Calculation.</br> School of Physics. RMUTT</center>");
   outputWin.document.write("<center> Date-Time of Printing :"+formatDate(new Date())+ "</center>");
   outputWin.document.write("<br/><center>Average Score :"+average.toFixed(2)+ 
   "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Standard Deviation :"+sd.toFixed(2)+ "</center>");
   var gradeSummary ="<center>";
   for (var element in gradeCount){
		gradeSummary += element + " = "+ gradeCount[element] + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
	}
	gradeSummary += "</center>";
   outputWin.document.write(gradeSummary);
   outputWin.document.write("<br/><center>");
   outputWin.document.write(document.getElementById("resultTable").outerHTML);
   
   outputWin.document.write("</center>");
   outputWin.document.write("<br/><center><font size=2>End of data table</font></center>")
   outputWin.print();
  // outputWin.close();
}
function calculate() {
var cookedScores = [];
var scores = [];
var numData,resultInTable;
	document.getElementById("printBtn").disabled = false;
	document.getElementById("showTable").innerHTML = "";
	scores = getData();
	//console.log(scores);
	numberOfData = scores.length;
	//console.log(numberOfData);
	if (numberOfData > 1) {
		//find mean 
		let sumOfData=0;
		for (let i=0; i < numberOfData; i++) {
		sumOfData += scores[i];
		}
		average = sumOfData / numberOfData;
		// find SD 
		let sumDifference=0;
		for (let i=0; i < numberOfData; i++) {
		sumDifference += (scores[i]- average)*(scores[i]- average);
		}
		sd = Math.sqrt(sumDifference/(numberOfData-1));
		//console.log(average);
		//console.log(sd);
		
		scores.sort(function(a,b) {return b-a}); // numeric sort scores descently 
		cookedScores = computeTScore(scores);
		resultInTable = displayTable(cookedScores);
		document.getElementById("showTable").innerHTML = resultInTable;
	
	} 
	
}
