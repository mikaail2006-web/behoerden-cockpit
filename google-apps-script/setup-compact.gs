const ROOT='Behoerden-Cockpit Murat Kocyigit';
const DB='Behoerden-Cockpit Datenbank';
const MAIN=['01_EM-Rente','02_Pflegegrad','03_GdB_100','04_Wohngeld','05_Kinderzuschlag','06_Krankenkasse','07_Arztberichte','08_Parkerleichterungen','09_Selbststaendigkeit','10_Steuern'];
const SUB=['01_Eingang','02_In_Bearbeitung','03_Antraege','04_Bescheide','05_Widerspruch','06_Nachweise','07_Archiv'];
const HEAD={
Config:['key','value','beschreibung'],
Dashboard:['bereich','offene_vorgaenge','offene_fristen','kritische_fristen','letzte_aktualisierung'],
Vorgaenge:['vorgang_id','bereich','status','prioritaet','behoerde','aktenzeichen','startdatum','naechster_schritt','fortschritt'],
Dokumente:['dokument_id','vorgang_id','bereich','dateiname','dokumenttyp','drive_url','eingangsdatum','ki_status'],
Fristen:['Fristdatum','Fristtitel','Bereich','BehoerdeName','VorgangsID','Telefon','Email','ErinnerungsTage','Status','NaechsterSchritt','Anmerkungen','','LetzteErinnerung'],
Checklisten:['checklist_id','bereich','titel','beschreibung','status'],
Kontakte:['kontakt_id','organisation','ansprechpartner','bereich','typ','email','telefon'],
Aufgaben:['aufgabe_id','vorgang_id','titel','bereich','faelligkeit','prioritaet','status'],
KI_Analysen:['analyse_id','dokument_id','dokument_name','zusammenfassung','risiko','naechster_schritt'],
Automationen:['automation_id','name','status','beschreibung','last_run'],
Portal_Nutzer:['person_id','name','email','rolle','status'],
Audit_Log:['log_id','zeitpunkt','aktion','objekt','bereich','details','quelle','level'],
Drive_Ordner:['bereich','ordner_typ','ordner_name','ordner_id','ordner_url']
};
const DATA={
Vorgaenge:[
['EMR-2026-001','EM-Rente','In Bearbeitung','critical','Deutsche Rentenversicherung','','2026-05-01','Aerztliche Unterlagen pruefen',62],
['PG-2026-002','Pflegegrad 2','Wartet','high','Pflegekasse','','2026-05-04','MD-Gutachten im Drive ablegen',74],
['GDB-2026-003','GdB 100','Offen','medium','Versorgungsamt','','2026-05-08','Bescheid pruefen',48],
['WG-2026-004','Wohngeld','Offen','medium','Wohngeldstelle','','2026-05-11','Einkommensnachweise ergaenzen',35],
['KK-2026-005','Krankenkasse','In Bearbeitung','low','Krankenkasse','','2026-05-18','Antwortfrist beobachten',58]
],
Dokumente:[
['DOC-001','EMR-2026-001','EM-Rente','DRV_Bescheid_EM_Rente.pdf','Bescheid','','2026-05-24','Analysiert'],
['DOC-002','PG-2026-002','Pflegegrad 2','MD_Gutachten_Pflegegrad.pdf','Gutachten','','2026-05-26','Analysiert'],
['DOC-003','WG-2026-004','Wohngeld','Wohngeld_Nachweise.zip','Nachweis','','2026-05-28','Nicht analysiert']
],
Fristen:[
['2026-06-14','Bescheid Frist pruefen','EM-Rente','Deutsche Rentenversicherung','EMR-2026-001','+491234567890','kontakt@drv.de',7,'Offen','Bescheid pruefen','-','',''],
['2026-06-12','Widerspruchsfrist EM-Rente pruefen','EM-Rente','Deutsche Rentenversicherung','EMR-2026-001','+491234567890','kontakt@drv.de',7,'Offen','Aerztliche Unterlagen pruefen','-','',''],
['2026-06-18','Wohngeld Nachweise einreichen','Wohngeld','Wohngeldstelle','WG-2026-004','+491234567891','kontakt@wohngeld.de',7,'Offen','Einkommensnachweise pruefen','-','',''],
['2026-07-02','GdB Bescheid kontrollieren','GdB 100','Versorgungsamt','GDB-2026-003','+491234567892','kontakt@versorgungsamt.de',7,'Offen','Merkzeichen und Bescheid pruefen','-','','']
],
Checklisten:[
['CL-001','EM-Rente','Aktuelle Arztberichte','Neurologie Orthopaedie Hausarzt','Offen'],
['CL-002','EM-Rente','Versicherungsverlauf pruefen','DRV-Verlauf kontrollieren','Offen'],
['CL-003','Pflegegrad 2','Pflegetagebuch','Hilfebedarf dokumentieren','Erledigt'],
['CL-004','Wohngeld','Mietnachweis','Mietvertrag bereitlegen','Offen']
],
Kontakte:[
['K-001','Deutsche Rentenversicherung','Sachbearbeitung EM-Rente','EM-Rente','Behoerde','kontakt@drv.example','080010004800'],
['K-002','Pflegekasse','Leistungsabteilung Pflege','Pflegegrad 2','Kasse','pflegekasse@example.de','']
],
Aufgaben:[
['A-001','EMR-2026-001','Arztberichte fuer EM-Rente zusammenstellen','EM-Rente','2026-06-05','high','Offen'],
['A-002','WG-2026-004','Einkommensnachweise fuer Wohngeld pruefen','Wohngeld','2026-06-10','medium','Offen']
],
KI_Analysen:[
['AN-001','DOC-001','DRV_Bescheid_EM_Rente.pdf','Bescheid zur EM-Rente mit moeglicher Frist erkannt.','mittel','Arztberichte verknuepfen und Frist pruefen.']
],
Automationen:[
['AUTO-001','Drive Dokumenteingang','active','Neue Dateien klassifizieren und verschieben.','Bereit'],
['AUTO-002','Taegliche Fristenpruefung','active','Offene Fristen pruefen und Erinnerungen senden.','Bereit']
],
Audit_Log:[
['LOG-001','2026-05-31 08:14','Dokument analysiert','DOC-001','EM-Rente','Dokument wurde klassifiziert.','KI','info']
]
};
function setupBehoerdenCockpit(){
  const root=folder_(DriveApp,ROOT);
  const ss=spread_();
  const rows=[['Root','root',root.getName(),root.getId(),root.getUrl()]];
  MAIN.forEach(function(m){
    const mf=folder_(root,m);
    rows.push([m,'hauptordner',mf.getName(),mf.getId(),mf.getUrl()]);
    SUB.forEach(function(s){
      const sf=folder_(mf,s);
      rows.push([m,'unterordner',sf.getName(),sf.getId(),sf.getUrl()]);
    });
  });
  Object.keys(HEAD).forEach(function(n){
    const sh=sheet_(ss,n);
    sh.clear();
    sh.getRange(1,1,1,HEAD[n].length).setValues([HEAD[n]]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,HEAD[n].length).setFontWeight('bold').setBackground('#dff2eb');
  });
  Object.keys(DATA).forEach(function(n){write_(ss.getSheetByName(n),DATA[n]);});
  const cfg=[
    ['root_folder_id',root.getId(),'Root folder ID'],
    ['root_folder_url',root.getUrl(),'Root folder URL'],
    ['spreadsheet_id',ss.getId(),'Google Sheet ID'],
    ['spreadsheet_url',ss.getUrl(),'Google Sheet URL'],
    ['n8n_data_api_url','https://DEINE-N8N-DOMAIN/webhook/behoerden-cockpit-data','Daten API'],
    ['n8n_document_check_url','https://DEINE-N8N-DOMAIN/webhook/document-check','Upload Webhook'],
    ['n8n_document_analysis_url','https://DEINE-N8N-DOMAIN/webhook/document-analysis','KI Analyse'],
    ['whatsapp_template_name','frist_erinnerung_de','WhatsApp Template'],
    ['whatsapp_recipient_phone','','WhatsApp Zielnummer']
  ];
  write_(ss.getSheetByName('Config'),cfg);
  write_(ss.getSheetByName('Drive_Ordner'),rows);
  const dash=MAIN.map(function(m){
    const a=area_(m);
    return [a,'=COUNTIFS(Vorgaenge!B:B,"'+a+'",Vorgaenge!C:C,"<>Erledigt")','=COUNTIFS(Fristen!C:C,"'+a+'",Fristen!I:I,"<>Erledigt")','=COUNTIFS(Fristen!C:C,"'+a+'",Fristen!I:I,"<>Erledigt",Fristen!A:A,"<="&TODAY()+3)',new Date()];
  });
  write_(ss.getSheetByName('Dashboard'),dash);
  move_(ss,root);
  Logger.log(JSON.stringify({rootFolderId:root.getId(),rootFolderUrl:root.getUrl(),spreadsheetId:ss.getId(),spreadsheetUrl:ss.getUrl()},null,2));
}
function folder_(p,n){const it=p.getFoldersByName(n);return it.hasNext()?it.next():p.createFolder(n);}
function spread_(){const f=DriveApp.getFilesByName(DB);return f.hasNext()?SpreadsheetApp.open(f.next()):SpreadsheetApp.create(DB);}
function sheet_(ss,n){return ss.getSheetByName(n)||ss.insertSheet(n);}
function write_(sh,rows){if(rows&&rows.length){sh.getRange(2,1,rows.length,rows[0].length).setValues(rows);sh.autoResizeColumns(1,sh.getLastColumn());}}
function area_(m){return m.replace(/^[0-9]+_/,'').replace(/_/g,' ').replace('Pflegegrad','Pflegegrad 2').replace('Selbststaendigkeit','Selbststaendigkeit');}
function move_(ss,root){const f=DriveApp.getFileById(ss.getId());root.addFile(f);try{DriveApp.getRootFolder().removeFile(f);}catch(e){}}
