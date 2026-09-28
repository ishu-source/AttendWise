import{P}from"../engine/attendance.js";
/* ===== DATA: timetables transcribed from the uploaded PDFs. Edit here to correct. =====
 Each day = 9 chars for periods 1-9 ('-' = no class; period 5 is lunch). Char = subject key. */
const s=(n,c)=>({n,c});
const DS2={A:s("Transforms and Boundary Value Problems","21MAB201T"),B:s("Solid State Devices","21ECC201T"),C:s("Computer Organization and Architecture","21CSS201T"),D:s("Digital Logic Design","21ECC203T"),E:s("Electromagnetic Theory and Interference","21ECC205T"),F:s("Professional Ethics","21LEM201T"),G:s("Universal Human Values-II","21LEM202T"),H:s("Verbal Reasoning","21PDM201L"),I:s("Social Engineering","21PDH209T"),L:s("Devices and Digital IC Laboratory","21ECC211L")};
const BM2={A:DS2.A,B:s("Biomedical Signals and Systems","21BMC202T"),C:s("Electric and Electronic Circuits","21BMC203J"),D:s("Digital Logic for Medical Systems","21BMC204J"),E:s("Medical Physics","21PYS202T"),F:DS2.F,G:DS2.G,H:DS2.H,I:s("Social Engineering","21PDH201T"),Q:s("DLMS/EEC Lab (lab block, not in subject table)","")};
const E3={A:s("Discrete Mathematics","21MAB302T"),B:s("Microprocessor, Microcontroller, and Interfacing Techniques","21ECC301P"),C:s("VLSI Design and Technology","21ECC303T"),F:s("Community connect","21GNP301L"),G:s("Analytical and logical thinking skills","21PDM301L"),H:s("Indian Art Form","21LEM301T"),L:s("VLSI Design/ Microprocessor Laboratory","21ECC311L"),P:s("B-Proj (project period, as printed)","")};
const SNOC=s("System and Network on Chip","21ECE468T"),ML=s("Machine learning for all","21CSO355T");
const E4={A:s("Behavioural Psychology","21GNH401T"),B:s("Wireless Communication and Antenna Systems","21ECC401T"),C:s("Computer Communication and Network Security","21ECC402P"),D:s("Semiconductor Memory Design","21ECE461T"),E:s("Scripting Language for Electronic Design Automation","21ECE463T"),F:ML,L:s("Computer Communication and Network Security (Lab)","21ECC402P")};
const TT={
"II ECE DS A":{s:DS2,d:["EAII-GGLL","CAED-G-HH","ABCD--H--","BCAF-LL--","DBEC-----"]},
"II ECE DS B":{s:DS2,d:["--LL-DBCI","LL---CDEA","G----IEAD","GGHH-ACBE","H----FABC"]},
"II BME":{s:BM2,d:["ECII-QQ--","CEBA-HH--","BDA--HG--","AEBD---QQ","FACD---GG"]},
"III ECE A":{s:{...E3,D:SNOC,E:ML},d:["EBBA-GG--","HDBP--G--","CADF---LL","AECF-----","DAEC-LL--"]},
"III ECE B":{s:{...E3,D:SNOC,E:ML},d:["LL---EBAD","GG---FBDC","G----PBAH","LL---ACEF","-----CAED"]},
"III ECE DS":{s:{...E3,D:ML,E:s("Database Design and Management","21ECE371T")},d:["EBCA-----","CBDF-LL--","HBAC---GG","ADEF-----","DAEP-G-LL"]},
"III BME":{s:{A:s("Probability and Statistics","21MAB301T"),B:s("Microcontrollers and Its Application in Medicine","21BMC302J"),C:s("Biomedical Signal Processing","21BMC301J"),D:s("Biometrics","21BME266T"),E:s("Modern wireless communication system","21ECO103T"),F:s("Principles of Medical Imaging","21BMC303T"),G:s("Analytical and Logical Thinking Skills","21PDM301L"),H:s("Indian Art Form","21LEM301T"),I:s("Community Connect","21GNP301L"),M:s("MPMC Lab (lab block, not in subject table)",""),N:s("BIO DSP Lab (lab block, not in subject table)","")},d:["GGMM-EBFH","NNG--CDAB","-----CAFD","---I-ACEB","I----FADE"]},
"IV ECE A":{s:E4,d:["C-AD-----","CDBF-----","BLEF-----","FAEB-----","CADE-----"]},
"IV ECE B":{s:E4,d:["CAEF-----","CEFB-----","CDAB-----","DBLA-----","EDF------"]},
"I Year":{verify:true}
};
export{TT};
