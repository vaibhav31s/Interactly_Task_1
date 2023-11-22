const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create a contact in CRM or database
app.post('/createContact', (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;
    console.log(req.body)
    console.log(first_name, last_name, email, mobile_number, data_store);
    if (!first_name || !last_name || !email || !mobile_number || !data_store) {
        return res.status(400).json({ error: 'Missing required parameters' + req.body } );
    }
    const contactData = {
        contact: {
            first_name: first_name,
            last_name: last_name,
            mobile_number: mobile_number,
            email: email
        }
    };

    if (data_store === 'CRM') {
        fetch('https://student-647385589481544619.myfreshworks.com/crm/sales/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': 'Token token=sWopdEVkadY--GECUCMEQg',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.status(200).json({ message: 'Contact created in CRM' , data: data});
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create contact in CRM' });
        });
    } else if (data_store === 'DATABASE') {
        
        return res.status(200).json({ message: 'Contact created in database' });
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Get a contact from CRM or database
app.post('/getContact', (req, res) => {
    const { contact_id, data_store } = req.body;

    if (!contact_id || !data_store) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (data_store === 'CRM') {
        fetch(`https://student-647385589481544619.myfreshworks.com/crm/sales/api/contacts/${contact_id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token token=sWopdEVkadY--GECUCMEQg',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.status(200).json({ contact: data });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to retrieve contact from CRM' });
        });
    } else if (data_store === 'DATABASE') {
        const contact = {
            id: contact_id,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            mobile_number: '1234567890'
        };

        return res.status(200).json({ contact });
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Update a contact in CRM or database
app.post('/updateContact', (req, res) => {
    const { contact_id, first_name, last_name, email, mobile_number, data_store } = req.body;
   
    if (!contact_id || !first_name || !last_name || !email || !mobile_number || !data_store) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const contactData = {
        contact: {
            first_name: first_name,
            last_name: last_name,
            mobile_number: mobile_number,
            email: email
        }
    };

    if (data_store === 'CRM') {
        fetch(`https://student-647385589481544619.myfreshworks.com/crm/sales/api/contacts/${contact_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Token token=sWopdEVkadY--GECUCMEQg',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.status(200).json({ message: 'Contact updated in CRM' , updateData: data});
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update contact in CRM' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Delete a contact from CRM or database
app.post('/deleteContact', (req, res) => {
    const { contact_id, data_store } = req.body;
   
    if (!contact_id || !data_store) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (data_store === 'CRM') {
        fetch(`https://student-647385589481544619.myfreshworks.com/crm/sales/api/contacts/${contact_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Token token=sWopdEVkadY--GECUCMEQg',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return res.status(200).json({ message: 'Contact deleted from CRM' });
            } else {
                throw new Error('Failed to delete contact from CRM');
            }
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete contact from CRM' });
        });
    } else if (data_store === 'DATABASE') {

        return res.status(200).json({ message: 'Contact deleted from DATABASE' });
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
