import { Contacts } from '@capacitor-community/contacts';

export const fetchDeviceContacts = async () => {
  try {
    // 1. Ask the user for permission to view contacts
    const permission = await Contacts.requestPermissions();
    if (permission.contacts !== 'granted') {
      console.warn('❌ Contacts permission denied');
      return [];
    }

    // 2. Fetch the actual phonebook
    const result = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
      }
    });

    // 3. Clean up the data so we can match it easily
    const cleanContacts = result.contacts.map(contact => {
      // Grab the first phone number and strip out spaces and country codes for easy matching
      const rawNumber = contact.phones?.[0]?.number || '';
      const cleanNumber = rawNumber.replace(/\D/g, '').slice(-10); // Keeps only the last 10 digits
      
      return {
        name: contact.name?.display || 'Unknown',
        number: cleanNumber
      };
    }).filter(c => c.number !== ''); // Remove contacts with no phone numbers

    console.log(`✅ Synced ${cleanContacts.length} contacts!`);
    return cleanContacts;

  } catch (error) {
    console.error("💥 Error fetching contacts:", error);
    return [];
  }
};