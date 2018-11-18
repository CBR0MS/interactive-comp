#include "../../bundle/basil.js";

function setup() {

  var jsonString = b.loadString("newPhilosophies.json");

  b.clear (b.doc());

  var pdfNumber = 0;
  var numberOfPages = 12;

  var jsonData = b.JSON.decode(jsonString);

  var inch = 72;

  var titleW = inch * 3.0;
  var titleH = inch * 1.5;
  var titleX = inch * 1.0; 
  var titleY = inch * 0.75;

  var textX = inch * 1.0; 
  var textY = inch * 3;
  var textW = inch * 4.0;
  var textH = inch * 5.0;

  var subH = inch * 1.0
  var subW = inch * 3;
  var subY = inch * 4.5;
  var subY1 = inch * 1.5;
  var headH = inch * 2.0;
  var headW = inch * 3.5;
  var headY = inch * 2.5;

  b.addPage()

  for (var i = 0; i < jsonData.length; i += 12) {

    var added = new Array();

    for (var k = i; k < (i + 12); k++) {
      added.push({'title': jsonData[k].title, 'text': jsonData[k].text})
    }

    added = added.sort();

    for (var k = 0; k < added.length; k++) {

      b.addPage()
      b.noStroke(); 
      b.fill(0,0,0);
      b.textSize(20);
  
      b.textFont("Vista Sans OTCE","Black Italic");
      b.textAlign(Justification.LEFT_ALIGN, VerticalJustification.BOTTOM_ALIGN );
    
      var name_frame = b.text(added[k]['title'], titleX,titleY,titleW,titleH);
      b.typo(name_frame, 'hyphenation', false);

      b.textSize(12);
      b.textFont("Lapture","Regular"); 
      b.textAlign(Justification.LEFT_JUSTIFIED, VerticalJustification.TOP_ALIGN);
    
      var p_frame = b.text(added[k]['text'], textX,textY,textW,textH);
      b.typo(p_frame, 'hyphenation', false);
    }
    
    b.page(1)

    b.textSize(16);
    b.textFont("Lapture","Regular"); 
    b.textAlign(Justification.LEFT_ALIGN, VerticalJustification.TOP_ALIGN);

    var sub_frame1 = b.text("The extended", textX,subY1,textW,subH);
    b.typo(sub_frame1, 'hyphenation', false);

    b.textSize(40);
    b.textFont("Vista Sans OTCE","Black Italic");
    b.textAlign(Justification.LEFT_ALIGN, VerticalJustification.TOP_ALIGN );
    
    var title_frame = b.text("Encyclopedia of Philosophy", titleX,headY,headW,headH);
    // b.typo(title_frame, 'capitalization', Capitalization.SMALL_CAPS);
    b.typo(title_frame, 'hyphenation', false);
    b.typo(title_frame, 'leading', 48);

    b.textSize(16);
    b.textFont("Lapture","Regular"); 
    b.textAlign(Justification.RIGHT_ALIGN, VerticalJustification.TOP_ALIGN);

    var sub_frame2 = b.text("A chapter of twelve new -isms", textX,subY,textW,subH);
    b.typo(sub_frame2, 'hyphenation', false);

    b.textFont("Lapture","Italic"); 
    b.textSize(11);
    b.textAlign(Justification.RIGHT_ALIGN, VerticalJustification.TOP_ALIGN);

    var sub = "(" + added[0]['title'] + " - " + added[11]['title'] + ")";
    var sub_frame3 = b.text(sub, (textX + (inch * 1.0)),(subY + (inch * 0.5)),subW,subH);
    b.typo(sub_frame3, 'hyphenation', false);

    b.savePDF(pdfNumber + "-chromsan.pdf");
    pdfNumber++;
    b.addPage()
    b.addPage()
    for (var j = numberOfPages + 2; j > 0; j--){
      b.removePage(j);
    }
  }
}

b.go(); 