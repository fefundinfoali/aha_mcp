import { AhaClient } from './src/aha-client.js';

// Load env vars (or hardcode them temporarily for this script)
const COMPANY = process.env.AHA_COMPANY;
const TOKEN = process.env.AHA_TOKEN;
const PRODUCT_ID = process.argv[2] || 'AI-INN'; // Pass product ID as arg or default to AI-INN

if (!COMPANY || !TOKEN) {
  console.error("Please set AHA_COMPANY and AHA_TOKEN env vars.");
  process.exit(1);
}

const client = new AhaClient(COMPANY, TOKEN);

async function findFields() {
  console.log(`🔍 Scanning Product: ${PRODUCT_ID}...\n`);

  // 1. Get an Initiative
  console.log("--- INITIATIVE FIELDS ---");
  const initRes = await client.listInitiatives(PRODUCT_ID);
  if (initRes.initiatives && initRes.initiatives.length > 0) {
    // Pick the first one that has custom fields
    const item = initRes.initiatives.find(i => i.custom_fields && i.custom_fields.length > 0) || initRes.initiatives[0];
    
    if (item.custom_fields) {
      item.custom_fields.forEach(f => {
        console.log(`Name: "${f.name}"  |  ID: ${f.key}  |  Value: ${f.value}`);
      });
    } else {
      console.log("No custom fields found on the first initiative.");
    }
  } else {
    console.log("No initiatives found.");
  }

  console.log("\n--- EPIC FIELDS ---");
  const epicRes = await client.listEpics(PRODUCT_ID, 1, 5);
  if (epicRes.epics && epicRes.epics.length > 0) {
    const item = epicRes.epics.find(e => e.custom_fields && e.custom_fields.length > 0) || epicRes.epics[0];
    
    if (item.custom_fields) {
      item.custom_fields.forEach(f => {
        console.log(`Name: "${f.name}"  |  ID: ${f.key}  |  Value: ${f.value}`);
      });
    } else {
      console.log("No custom fields found on the first epic.");
    }
  } else {
    console.log("No epics found.");
  }
}

findFields().catch(console.error);