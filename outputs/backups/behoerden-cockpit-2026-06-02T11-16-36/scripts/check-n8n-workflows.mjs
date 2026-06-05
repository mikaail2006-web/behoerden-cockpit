import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const whatsappWorkflow = JSON.parse(readFileSync("n8n/workflow-fristen-whatsapp-erinnerung.json", "utf8"));
const whatsappText = JSON.stringify(whatsappWorkflow);

assert.equal(whatsappText.includes("WHATSAPP_RECIPIENT_PHONE_HERE"), false, "WhatsApp-Empfaenger muss aus Fristen.Telefon kommen");
assert.equal(whatsappText.includes("WHATSAPP_PHONE_NUMBER_ID"), true, "WhatsApp Phone-Number-ID Platzhalter fehlt");
assert.equal(whatsappText.includes("REPLACE_WITH_WHATSAPP_CREDENTIAL_ID"), true, "WhatsApp Credential Platzhalter fehlt");
assert.equal(whatsappText.includes("templateParams"), true, "WhatsApp Template-Parameter fehlen");
assert.equal(whatsappText.includes("LetzteErinnerung"), true, "WhatsApp Duplikatschutz fehlt");
assert.equal(whatsappText.includes("WhatsAppOptIn"), true, "WhatsApp Opt-in Logik fehlt");

const ocrWorkflow = JSON.parse(readFileSync("n8n/workflow-ocr-ki-analyse.json", "utf8"));
const ocrText = JSON.stringify(ocrWorkflow);

assert.equal(ocrText.includes("REPLACE_WITH_AI_API_CREDENTIAL_ID"), true, "KI Credential Platzhalter fehlt");
assert.equal(ocrText.includes("REPLACE_WITH_MODEL"), true, "KI Modell Platzhalter fehlt");
assert.equal(ocrText.includes("document-analysis"), true, "KI Analyse Webhook fehlt");

console.log("n8n workflow checks ok");
