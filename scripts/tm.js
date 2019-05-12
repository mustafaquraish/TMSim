// All the vars we need to keep track of the TM
var transitions;
var tape = [];
var curPos;
var curState;
var initState;
var acceptState;
var rejectState;
var blankSym;

function loadTM(inpStr) {
  // Load in the lines
  linesArr = inpStr.split("\n");
  line = linesArr[0].split(" ");
  // Load up special symbols/states
  blankSym = line[0]
  initState = line[1]
  acceptState = line[2]
  rejectState = line[3]

  // Add every transition to the global dictionary
  for (let c = 1; c < linesArr.length; c++) {
    // Newline signifies end of transitions
    if (linesArr[c] == "") {
      break;
    }

    line = linesArr[c].split(" ");
    let iStt = line[0];
    let iSyms = line[1];
    let oStt = line[2];
    let oSym = line[3];
    let oDir = line[4];

    for (let iSym of iSyms.split(",")) {
      let tInp = iStt + "," + iSym;
      let tOut;
      if (oSym == ".") {
        tOut = oStt + "," + iSym + "," + oDir;
      } else {
        tOut = oStt + "," + oSym + "," + oDir;
      }

      if (!transitions) {
        transitions = createStringDict(tInp, tOut);
      } else if (!transitions.hasKey(tInp)) {
        transitions.create(tInp, tOut);
      }
    }
  }
  // transitions.print();

  // Set up current state
  curState = initState;
  curPos = 0;
  tape.push(blankSym);
}

function loadTape(inpStr) {
  /* Add input to the tape, and a blank symbol at the end */
  tape = inpStr.split("");
  tape.push(blankSym);
}

function followTransition() {

  let tInp = curState + "," + tape[curPos];


  if (transitions.hasKey(tInp)) {
    let tOut = transitions.get(tInp);
    let oStt = tOut.split(",")[0];
    let oSym = tOut.split(",")[1];
    let oDir = tOut.split(",")[2];


    curState = oStt;        // Update State
    tape[curPos] = oSym;    // Update Symbol
    if (oDir == "R") {      // Update position
      // Add a new blank at the end if needed
      if (curPos++ >= tape.length - 1) {
        tape.push(blankSym);
      }
    } else if (oDir == "L") {
      // Bound the position to >= 0
      curPos = max(0, curPos - 1);
    }
    return;
  }

  curState = rejectState;
  curPos++;
  return;
}