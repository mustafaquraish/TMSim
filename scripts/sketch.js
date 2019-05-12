/* Turing Machine Simulator

Made for use with TMs encoded in the tm2file format
(http://www.utsc.utoronto.ca/~nick/cscC63/tm/tm2file)

Mustafa Quraish, 2019.
*/


var STEPS = 0;
var MAX_STEPS = 1500;

// These are to interact with the DOM elements
var loadBtn, oneStepBtn, allStepBtn;
var outText, inTM, inStr, inMaxSteps;


function updateText() {
  /* Adds the text representation of the current state to output */
  var oldText = outText.html();
  var tempTape = tape.slice();
  tempTape.splice(curPos, 0, curState);
  var newLine = "Step " + (("⠀⠀⠀⠀" + STEPS).slice(-3)) + ":" + "&nbsp;".repeat(4) + tempTape.join(" ")

  // var newLine = "Step " + STEPS + " &nbsp; &nbsp; : &nbsp; &nbsp;" + tempTape.join(" ")
  if (curState == acceptState) {
    newLine += "<br> <p style='text-align:center; padding-top: 20pt;'>Accepted</p>";
  } else if (curState == rejectState) {
    newLine += "<br> <p style='text-align:center; padding-top: 20pt;'>Rejected</p>";
  }
  outText.html(oldText + "<br>" + newLine);
  
  // Using native JS here instead of P5 to scroll down
  var objDiv = document.getElementById("right_div");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function runStep() {
  /* Runs one step of the TM if not halted */
  if (curState == acceptState || curState == rejectState) {
    return false;
  }
  STEPS++;
  followTransition();
  updateText();
  return true;
}

function runMax() {
  /* Runs TM up till it (i) Halts, or (ii) reaches MAX_ITERS steps */
  for (let s = STEPS; s < MAX_STEPS; s++) {
    if (!runStep()) {
      break;
    }
  }
}

function loadInput() {
  /* Handler for the LOAD button. Loads up the TM and string from
    input areas, sets the MAX_ITERS and resets counters */
  transitions = undefined;
  tape = []
  loadTM(inTM.value());
  loadTape(inStr.value());
  outText.html(" <p style='text-align:center;'>Loaded String '" + inStr.value() + "'</p>");
  STEPS = 0;
  updateText();
  MAX_STEPS = int(inMaxSteps.value());
}

function setup() {

  noCanvas();

  // Get Text area for TM, set up drag and drop
  inTM = select("textarea");
  inTM.dragOver(() => { inTM.style('background-color', '#ccc') });
  inTM.dragLeave(() => { inTM.style('background-color', '#fff') });
  inTM.drop((file) => { inTM.value("" + file.data); 
                        inTM.style('background-color', '#fff') });
  // Input String
  inStr = select("#tapeInput");
  inMaxSteps = select("#maxSteps");
  // Load Button
  loadBtn = select("#load");
  loadBtn.mousePressed(loadInput);
  // Run One Step
  oneStepBtn = select("#runOne")
  oneStepBtn.mousePressed(runStep);
  // Run Max Steps
  allStepBtn = select("#runMax")
  allStepBtn.mousePressed(runMax);
  // Paragraph for output
  outText = select("#output");

  // Set defaults...
  inTM.value(defaultTM);
  inStr.value("0000");
  inMaxSteps.value("300");
  loadInput();
}





// Default TM Description
var defaultTM = 
`- q1 qA qR      Language:  L = {0^2^n | n >= 0}
q1 0 q2 - R
q2 - qA - R
q2 0 q3 x R
q2 x q2 x R
q3 - q5 - L 
q3 0 q4 0 R 
q3 x q3 x R 
q4 0 q3 x R 
q4 x q4 x R 
q5 - q2 - R 
q5 0 q5 0 L 
q5 x q5 x L`