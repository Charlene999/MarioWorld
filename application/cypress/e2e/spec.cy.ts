describe('Home Page', () => {
  it('Login Button Redirects Correctly', () => {
    cy.visit('http://localhost:4200/')
    cy.url().should('include', 'http://localhost:4200/')
    cy.get('#login').click()
    cy.url().should('include', 'http://localhost:4200/login')
  })

  it('Sign Up Button Redirects Correctly', () => {
    cy.visit('http://localhost:4200/')
    cy.url().should('include', 'http://localhost:4200/')
    cy.get('#signup').click()
    cy.url().should('include', 'http://localhost:4200/signup')
  })
})

//
//Anonymous User Pages
//

describe('Sign Up Page', () => {
  it('User Already Exists - POST Request and Expected Response', () => {
    cy.visit('http://localhost:4200/signup')
    cy.url().should('include', 'http://localhost:4200/signup')

    cy.request({
      method: 'POST', 
      url: 'http://localhost:8080/users/create', 
      body: JSON.stringify({ name: 'User', username: 'user', email: 'user@user.com', password: 'theperfectpath' }),
      headers: {'Content-Type': 'application/json'},
      failOnStatusCode: false
    })
    .then( (response) => {
        expect(response.status).to.eq(409)
      }
    )
  })

  it('User Already Exists', () => {
    cy.visit('http://localhost:4200/signup')
    cy.url().should('include', 'http://localhost:4200/signup')

    cy.get('#name').type('User')
    cy.get('#name').should('have.value', 'User')

    cy.get('#username').type('user')
    cy.get('#username').should('have.value', 'user')

    cy.get('#email').type('user@user.com')
    cy.get('#email').should('have.value', 'user@user.com')

    cy.get('#password').type('theperfectpath')
    cy.get('#password').should('have.value', 'theperfectpath')

    cy.get('#submit').click()
  })

  it('New User Successfully Created', () => {
  //NOTE: The user created here MUST match the edited/deleted user on the /admin/view-users page.
  //Else, the test will fail every subsequent iteration, since the character will already exist in the backend.
    cy.visit('http://localhost:4200/signup')
    cy.url().should('include', 'http://localhost:4200/signup')

    cy.get('#name').type('Test User')
    cy.get('#name').should('have.value', 'Test User')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#email').type('fake@fakemail.com')
    cy.get('#email').should('have.value', 'fake@fakemail.com')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click()
  })
})

describe('Login Page', () => {
  it('Input Invalid Username and Password - POST Request and Expected Response', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.request({
      method: 'POST', 
      url: 'http://localhost:8080/users/login', 
      body: JSON.stringify({ username: 'dylan', password: 'password' }),
      headers: {'Content-Type': 'application/json'},
      failOnStatusCode: false
    })
    .then( (response) => {
        expect(response.status).to.eq(404)
      }
    )
  })

  it('Input Invalid Username and Password', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('dylan')
    cy.get('#username').should('have.value', 'dylan')

    cy.get('#password').type('password')
    cy.get('#password').should('have.value', 'password')
    
    cy.get('#submit').click()    
  })
  
  it('Input Valid Username and Password', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')
  })
})

//
//Normal User Pages
//

describe('Profile Page', () => {

  //Before each test, login and navigate to /profile page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')
  })

  it('Update Name Option Redirects Correctly', () => {
    cy.get('#userData').select(1).trigger('click')
    cy.url().should('include', 'http://localhost:4200/profile/name')
  })

  it('Update Username Option Redirects Correctly', () => {
    cy.get('#userData').select(2).trigger('click')
    cy.url().should('include', 'http://localhost:4200/profile/email')
  })

  it('Update Password Option Redirects Correctly', () => {
    cy.get('#userData').select(3).trigger('click')
    cy.url().should('include', 'http://localhost:4200/profile/pass')
  })
})

describe('Edit Name Page', () => {
  it('Successfully Updates Name then Redirects to Profile Page', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#userData').select(1).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/name')

    cy.get('#name').type('Dylan')
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')
  })
})

describe('Edit Email Page', () => {
  it('Successfully Updates Email then Redirects to Profile Page', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#userData').select(2).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/email')

    cy.get('#email').type('updatedemail@fakemail.edu')
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')
  })
})

describe('Edit Password Page', () => {
  it('Successfully Updates Password then Redirects to Profile Page', () => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#userData').select(3).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/pass')

    cy.get('#password').type('theperfectuser')
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')
  })
})

//
//Both Types of Users Pages
//

describe('Classes Page', () => {
  it('Successfully navigate to Classes page from Navbar', () => { 

    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#classestab').click()

    cy.url().should('include', 'http://localhost:4200/classes')
  })
})

describe('Spells Page', () => {

  //Before each test, login and navigate to the /spells page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    // Go to spells page
    cy.get('#spells').click()

    cy.url().should('include', 'http://localhost:4200/spells')
  })

  it('Spells Page Renders with all spells loaded', () => {
    cy.get('#tabl').contains('td', 'Sniper Shot')
    cy.get('#tabl').contains('td', 'Hamstring')
    cy.get('#tabl').contains('td', 'Sing')
  })

  it('Selecting Barbarian From Dropdown Works', () => {
    //Select Barbarian option from dropdown
    cy.get('#classes').select(3).trigger('click')

    cy.get('#tabl').contains('td', 'Mortal Strike')
    cy.get('#tabl').contains('td', 'Hamstring')
  })
})

describe('Items Page', () => {

  //Before each test, login and navigate to the /items page
  beforeEach(() => {
    //Login
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/profile')

    //Go to items page via Navbar
    cy.get('#items').click()

    cy.url().should('include', 'http://localhost:4200/items')
  })
  
  it('Items page renders with all items loaded', () => {
    cy.get('#tabl').contains('td', 'Frost Wand')
    cy.get('#tabl').contains('td', 'Spiky Club')
    cy.get('#tabl').contains('td', 'Flute')
  })

  it('Selecting Sorcerer From Dropdown Works', () => {
    //Select Sorcerer option from dropdown
    cy.get('#classes').select(2).trigger('click')

    cy.get('#tabl').contains('td', 'Frost Wand')
    cy.get('#tabl').contains('td', 'Fire Wand')
  })
})

describe('Create A New Character Page', () => {

  //Before each test, login and navigate to the /profile/create-character page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#chars').select(1).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/create-character')
  })

  it('Successfully Creates a New Character', () => {
    // Character should be submitted properly
    cy.get('#Name').type('Tlachtga')
    cy.get('#Name').should('have.value', 'Tlachtga')

    cy.get('#Desc').type('A powerful druidess from Irish mythology.')
    cy.get('#Desc').should('have.value', 'A powerful druidess from Irish mythology.')

    cy.get('#character_dropdown').select(20).trigger('click')

    cy.get('#class_dropdown').select(4).trigger('click')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile/create-character')
  })
})

describe('Character Spells Page', () => {

  //Before each test, login and navigate to /profile/spells page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#chars').select(3).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/spells')
  })

  it('Successfully add a spell to a character', () => {
    cy.intercept('POST', '**/spells/get').as('getSpells')
    cy.intercept('POST', '**/characters/addspell').as('addSpell')

    cy.get('#spellChars').select('Tlachtga - Druid')
    cy.get('#spellChars').select('Tlachtga - Druid')

    cy.wait('@getSpells')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Unowned')
    .should('be.visible')

    cy.get("tr td:nth-child(5)")       //Gets the Add column (5th column)
    .eq(0)                            //Get the 2nd row
    .click()

    cy.wait('@addSpell')

    cy.reload(true)

    cy.get('#spellChars').select('Tlachtga - Druid')
    cy.get('#spellChars').select('Tlachtga - Druid')

    cy.wait('@getSpells')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Owned')
    .should('be.visible')
  })

  it('Successfully remove a spell from a character', () => {
    cy.intercept('POST', '**/spells/get').as('getSpells')
    cy.intercept('DELETE', '**/characters/removespell').as('removeSpell')

    cy.get('#spellChars').select('Tlachtga - Druid')
    cy.get('#spellChars').select('Tlachtga - Druid')

    cy.wait('@getSpells')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Owned')
    .should('be.visible')

    cy.get("tr td:nth-child(6)")       //Gets the Delete column (6th column)
    .eq(0)                            //Get the 2nd row
    .click()

    cy.wait('@removeSpell')

    cy.reload(true)

    cy.get('#spellChars').select('Tlachtga - Druid')
    cy.get('#spellChars').select('Tlachtga - Druid')

    cy.wait('@getSpells')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Unowned')
    .should('be.visible')
  })  
})

describe('Character Items Page', () => {
  //Before each test, login and navigate to /profile/items page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#chars').select(4).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/items')
  })

  it('Successfully add an item to a character', () => {
    cy.intercept('POST', '**/items/get').as('getItems')
    cy.intercept('POST', '**/characters/additem').as('addItem')

    cy.get('#itemChars').select('Tlachtga - Druid')
    cy.get('#itemChars').select('Tlachtga - Druid')

    cy.wait('@getItems')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Unowned')
    .should('be.visible')

    cy.get("tr td:nth-child(5)")       //Gets the Add column (5th column)
    .eq(0)                            //Get the 2nd row
    .click()

    cy.wait('@addItem')

    cy.reload(true)

    cy.get('#itemChars').select('Tlachtga - Druid')
    cy.get('#itemChars').select('Tlachtga - Druid')

    cy.wait('@getItems')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Owned')
    .should('be.visible')
  })

  it('Successfully remove an item from a character', () => {
    cy.intercept('POST', '**/items/get').as('getItems')
    cy.intercept('DELETE', '**/characters/removeitem').as('removeItem')

    cy.get('#itemChars').select('Tlachtga - Druid')
    cy.get('#itemChars').select('Tlachtga - Druid')

    cy.wait('@getItems')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Owned')
    .should('be.visible')

    cy.get("tr td:nth-child(6)")       //Gets the Delete column (6th column)
    .eq(0)                            //Get the 2nd row
    .click()

    cy.wait('@removeItem')

    cy.reload(true)

    cy.get('#itemChars').select('Tlachtga - Druid')
    cy.get('#itemChars').select('Tlachtga - Druid')

    cy.wait('@getItems')

    cy.get("tr td:nth-child(4)")       //Gets the Owned column (4th column)
    .eq(0)                            //Get the 2nd row
    .contains('td', 'Unowned')
    .should('be.visible')
  })  
})

describe('View All Characters Page', () => {

  //Before each test, navigate to the /profile/characters page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('testuser10')
    cy.get('#username').should('have.value', 'testuser10')

    cy.get('#password').type('theperfectuser')
    cy.get('#password').should('have.value', 'theperfectuser')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/profile')

    cy.get('#chars').select(2).trigger('click')

    cy.url().should('include', 'http://localhost:4200/profile/characters')
  })

  it('Successfully Shows All Characters', () => {
    // Table should have all characters that were created
    cy.get('#tabl').contains('td', 'Tlachtga').should('be.visible')
  })

  it('Successfully Edit a Character', () => {
    cy.intercept('POST', '**/characters/get').as('getChars')
    cy.intercept('PUT', '**/characters/update').as('updateChar')

    //cy.wait('@getChars')

    //Insert a new name
    cy.get("tr td:nth-child(1)")       
    .eq(1)           
    .contains('td', 'Tlachtga')                 
    .clear()
    .type('New Druid Name')

    //Update
    cy.get("tr td:nth-child(6)")       //Gets the Edit column (6th column)
    .eq(0)                            
    .click()

    cy.wait('@updateChar')

    cy.reload(true)

    //Check the name to verify update was successful
    cy.get("tr td:nth-child(1)")
    .eq(1)
    .contains('td', 'NEW DRUID NAME')  
  })

  it('Successfully Delete a Character', () => {
    cy.intercept('POST', '**/characters/get').as('getChars')
    cy.intercept('DELETE', '**/characters/delete').as('deleteChar')

    //cy.wait('@getChars')

    //Delete Character
    cy.get("tr td:nth-child(5)")       //Gets the Delete column (5th column)
    .eq(0)                            
    .click()

    cy.wait('@deleteChar')

    cy.reload(true)

    //cy.wait('@getChars')

    //Check the name to verify deletion was successful
    cy.get("tr td:nth-child(1)")
    .eq(1)                            
    .should('not.exist')
  })  
})

//
//Admin Pages
//

describe('Admin Page', () => {

  //Before each test, login and navigate to /admin page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('admin')
    cy.get('#username').should('have.value', 'admin')

    cy.get('#password').type('theperfectpath')
    cy.get('#password').should('have.value', 'theperfectpath')
    
    cy.get('#submit').click()

    cy.url().should('include', 'http://localhost:4200/admin')
  })

  it('View Existing Users Button Redirects Correctly', () => {
    cy.get('#viewusers').click()
    cy.url().should('include', 'http://localhost:4200/admin/view-users')
  })

  it('Create Spells or Items Button Redirects Correctly', () => {
    cy.get('#additemspells').click()
    cy.url().should('include', 'http://localhost:4200/admin/add-spells-and-items')
  })

  it('Remove Spells or Items Redirects Correctly', () => {
    cy.get('#removeitemspells').click()
    cy.url().should('include', 'http://localhost:4200/admin/delete-spells-and-items')
  })
})

describe('View Existing Users Page', () => {

  //Before each test, login and navigate to /admin/view-users page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('admin')
    cy.get('#username').should('have.value', 'admin')

    cy.get('#password').type('theperfectpath')
    cy.get('#password').should('have.value', 'theperfectpath')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/admin')

    cy.get('#viewusers').click()

    cy.url().should('include', 'http://localhost:4200/admin/view-users')
  })

  it('Successfully Edit a User', () => {
    cy.intercept('POST', '**/users/getall').as('getAllUsers')
    cy.intercept('PUT', '**/users/admin_update').as('updateUser')

    //Check the name
    cy.get("tr td:nth-child(1)")       //Gets the Name column (1st column)
    .eq(5)                            //Get the last row
    .contains('td', 'Dylan')
    .should('be.visible')

    //Get user to edit from dropdown
    cy.get('#chooseUser').select('testuser10')

    //Fill in Form
    cy.get('#name').type('Test User')
    cy.get('#name').should('have.value', 'Test User')

    //Submit update
    cy.get('#edit').click()

    cy.wait('@updateUser')

    cy.reload(true)

    cy.wait('@getAllUsers')

    //Check if user information updated
    cy.get("tr td:nth-child(1)")       //Gets the Name column (1st column)
    .eq(5)                            //Get the last row
    .contains('td', 'Test User')
    .should('be.visible')
  })

  it('Successfully Delete a User', () => {
    cy.intercept('POST', '**/users/getall').as('getAllUsers')
    cy.intercept('DELETE', '**/users/delete').as('deleteUser')

    cy.get("tr td:nth-child(6)")       //Gets the Delete User column (6th column)
    .eq(4)                            //Get the 19th row
    .click()

    cy.wait('@deleteUser')

    cy.reload(true)

    cy.wait('@getAllUsers')

    //Check that the user deletion was successful
    cy.get("tr td:nth-child(1)")
    .eq(5)                            
    .should('not.exist')
  })
})

describe('Create Spells or Items Page', () => {

  //Before each test, login and navigate to /admin/add-spells-and-items page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('admin')
    cy.get('#username').should('have.value', 'admin')

    cy.get('#password').type('theperfectpath')
    cy.get('#password').should('have.value', 'theperfectpath')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/admin')

    cy.get('#additemspells').click()

    cy.url().should('include', 'http://localhost:4200/admin/add-spells-and-items')
  })

  it('Test Item Reset and Successfully Create Item', () => {
    cy.get('#itemname').type('A new item')
    cy.get('#itemname').should('have.value', 'A new item')

    cy.get('#itemdescription').type('A new item')
    cy.get('#itemdescription').should('have.value', 'A new item')

    cy.get('#character_dropdown_item').select(11).trigger('click')

    cy.get('#class_dropdown_item').select(9).trigger('click')

    cy.get('#itemreset').click();

    cy.get('#itemname').type('A new item')
    cy.get('#itemname').should('have.value', 'A new item')

    cy.get('#itemdescription').type('A new item')
    cy.get('#itemdescription').should('have.value', 'A new item')

    cy.get('#character_dropdown_item').select(11).trigger('click')

    cy.get('#class_dropdown_item').select(9).trigger('click')

    cy.get('#itemsubmit').click();
  })

  it('Test Spell Reset and Successfully Create Spell', () => {
    cy.get('#spellname').type('A new spell')
    cy.get('#spellname').should('have.value', 'A new spell')

    cy.get('#spelldescription').type('A new spell')
    cy.get('#spelldescription').should('have.value', 'A new spell')

    cy.get('#character_dropdown_spell').select(11).trigger('click')

    cy.get('#class_dropdown_spell').select(9).trigger('click')

    cy.get('#spellreset').click();

    cy.get('#spellname').type('A new spell')
    cy.get('#spellname').should('have.value', 'A new spell')

    cy.get('#spelldescription').type('A new spell')
    cy.get('#spelldescription').should('have.value', 'A new spell')

    cy.get('#character_dropdown_spell').select(11).trigger('click')

    cy.get('#class_dropdown_spell').select(9).trigger('click')

    cy.get('#spellsubmit').click();
  })
})

describe('Delete Spells or Items Page', () => {

  //Before each test, login and navigate to the /admin/delete-spells-and-items page
  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.url().should('include', 'http://localhost:4200/login')

    cy.get('#username').type('admin')
    cy.get('#username').should('have.value', 'admin')

    cy.get('#password').type('theperfectpath')
    cy.get('#password').should('have.value', 'theperfectpath')

    cy.get('#submit').click();

    cy.url().should('include', 'http://localhost:4200/admin')

    cy.get('#removeitemspells').click()

    cy.url().should('include', 'http://localhost:4200/admin/delete-spells-and-items')
  })

  it('Successfully Edit an Item', () => {
    cy.intercept('POST', '**/items/get').as('getItems')
    cy.intercept('PUT', '**/items/update').as('updateItem')

    //Insert a new name
    cy.get('#itemTabl tr td:nth-child(1)')   
    .eq(19)                            
    .contains('td', 'A new item')
    .clear()
    .type('A paladin item')

    //Update
    cy.get("#itemTabl tr td:nth-child(6)")       //Gets the Edit column (6th column)
    .eq(18)                            
    .click()

    cy.wait('@updateItem')

    cy.reload(true)

    cy.wait('@getItems')

    //Check the name to verify update was successful
    cy.get("#itemTabl tr td:nth-child(1)")       
    .eq(19)                            
    .contains('td', 'A PALADIN ITEM')
  })

  it('Successfully Delete an Item', () => {
    cy.intercept('POST', '**/items/get').as('getItems')
    cy.intercept('DELETE', '**/items/delete').as('deleteItem')

    //Check the name
    cy.get("#itemTabl tr td:nth-child(1)")       
    .eq(19)                            
    .contains('td', 'A PALADIN ITEM')

    //Delete the item
    cy.get("#itemTabl tr td:nth-child(5)")       //Gets the Delete column (5th column)
    .eq(18)                            
    .click()

    cy.wait('@deleteItem')

    cy.reload(true)

    cy.wait('@getItems')

    //Check the name to verify deletion was successful
    cy.get("#itemTabl tr td:nth-child(1)")       
    .eq(19)                            
    .should('not.exist')
  })

  it('Successfully Edit an Spell', () => {
    cy.intercept('POST', '**/spells/get').as('getSpells')
    cy.intercept('PUT', '**/spells/update').as('updateSpell')

    //Insert a new name
    cy.get('#spellTabl tr td:nth-child(1)')   
    .eq(21)                            
    .contains('td', 'A new spell')
    .clear()
    .type('A paladin spell')

    //Update
    cy.get("#spellTabl tr td:nth-child(6)")       //Gets the Edit column (6th column)
    .eq(20)                            
    .click()

    cy.wait('@updateSpell')

    cy.reload(true)

    cy.wait('@getSpells')

    //Check the name to verify update was successful
    cy.get("#spellTabl tr td:nth-child(1)")       
    .eq(21)                            
    .contains('td', 'A PALADIN SPELL')
  })

  it('Successfully Delete a Spell', () => {
    cy.intercept('POST', '**/spells/get').as('getSpells')
    cy.intercept('DELETE', '**/spell/delete').as('deleteSpell')

    //Check the name
    cy.get("#spellTabl tr td:nth-child(1)")       
    .eq(21)                            
    .contains('td', 'A PALADIN SPELL')

    //Delete the spell
    cy.get("#spellTabl tr td:nth-child(5)")       //Gets the Delete column (5th column)
    .eq(20)                            
    .click()

    cy.reload(true)

    //Check the name to verify deletion was successful
    cy.get("#spellTabl tr td:nth-child(1)")       
    .eq(21)                            
    .should('not.exist')
  })
})
