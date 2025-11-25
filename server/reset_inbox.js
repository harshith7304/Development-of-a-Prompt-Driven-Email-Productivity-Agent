const fs = require('fs');
const path = require('path');

const INBOX_FILE = path.join(__dirname, 'data', 'inbox.json');

const resetInbox = () => {
    if (!fs.existsSync(INBOX_FILE)) {
        console.error('Inbox file not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(INBOX_FILE, 'utf8'));

    const resetData = data.map(email => {
        // Skip drafts created by user, but reset mock emails
        if (email.isDraft) return email;

        // Remove classification data
        const { category, actions, processed, ...rest } = email;

        // Return clean email object
        return {
            ...rest,
            // Ensure category is removed or null so it shows as Uncategorized
            category: null,
            processed: false
        };
    });

    fs.writeFileSync(INBOX_FILE, JSON.stringify(resetData, null, 2));
    console.log('✅ Inbox reset successfully! All classifications and actions have been cleared.');
};

resetInbox();
