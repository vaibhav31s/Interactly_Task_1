const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql');
// import fetch from 'node-fetch';


app.use(express.json());
const dbConnection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'contact',
  });
  
  dbConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
    } else {
      console.log('Connected to MySQL database successfully!');
    //   console.log('getting contacts table');
    //     dbConnection.query('SELECT * FROM contact', (error, results, fields) => {
    //         if (error) {
    //         console.error('Error getting contact from database: ', error);
    //         } else {
    //         console.log('Contacts: ', results);
    //         }
    //     });
        
    }
  });
// Create a contact in CRM or database
app.post('/createContact', async (req, res) => {
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
        const sql = `INSERT INTO contact (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)`;
        const values = [first_name, last_name, email, mobile_number];

        return await dbConnection.query(sql, values, (error, results, fields) => {
            if (error) {
            console.error('Error creating contact in database: ', error);
            } else {
            console.log('Contact created in database: ', results);
            return res.status(200).json({ message: 'Contact created in database' , data: results });
            }
        }
        );
    } 
    
    else {

        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Get a contact from CRM or database
app.post('/getContact', async (req, res) => {
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
        const sql = `SELECT * FROM contact WHERE contact_id = ?`;
        const values = [contact_id];

        

       return await dbConnection.query(sql, values, (error, results, fields) => {
            if (error) {
            console.error('Error retrieving contact from database: ', error);
            } else {
            console.log('Contact retrieved from database: ', results);
            return res.status(200).json({ contact: results });
            }
        }
        );
        
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Update a contact in CRM or database
app.post('/updateContact', async (req, res) => {
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
    } else if(data_store === 'DATABASE'){
        const sql = `UPDATE contact SET first_name = ?, last_name = ?, email = ?, mobile_number = ? WHERE contact_id = ?`;
        const values = [first_name, last_name, email, mobile_number, contact_id];

        return await dbConnection.query(sql, values, (error, results, fields) => {
            if (error) {
            console.error('Error updating contact in database: ', error);
            } else {
            console.log('Contact updated in database: ', results);
            return res.status(200).json({ message: 'Contact updated in database' , updateData: results });
            }
        }
        );
    }else
    {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});

// Delete a contact from CRM or database
app.post('/deleteContact', async (req, res) => {
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
                return res.status(200).json({ message: 'Contact deleted from CRM' , data: response });
            } else {
                throw new Error('Failed to delete contact from CRM');
            }
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete contact from CRM' });
        });
    } else if (data_store === 'DATABASE') {
        const sql = `DELETE FROM contact WHERE contact_id = ?`;
        const values = [contact_id];

        return await dbConnection.query(sql, values, (error, results, fields) => {
            if (error) {
            console.error('Error deleting contact from database: ', error);
            } else {
            console.log('Contact deleted from database: ', results);
            return res.status(200).json({ message: 'Contact deleted from database' , data: results });
            }
        }
        );
    } else {
        return res.status(400).json({ error: 'Invalid data_store value' });
    }
});




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
