
const fs=require("fs");
const path=require("path");
const readline=require("readline");

const bookFile=path.join(__dirname,"book.json");
const userFile=path.join(__dirname,"user.json");

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

function input(question){
    return new Promise(resolve=>rl.question(question,resolve));
}

async function createFiles(){
    if(!fs.existsSync(bookFile)){
        await fs.promises.writeFile(bookFile,"[]");
    }

    if(!fs.existsSync(userFile)){
        await fs.promises.writeFile(userFile,JSON.stringify({
            accounts:[],
            issues:[]
        },null,2));
    }

    let bookData=await fs.promises.readFile(bookFile,"utf8");
    let userData=await fs.promises.readFile(userFile,"utf8");

    if(bookData.trim()===""){
        await fs.promises.writeFile(bookFile,"[]");
    }

    if(userData.trim()===""){
        await fs.promises.writeFile(userFile,JSON.stringify({
            accounts:[],
            issues:[]
        },null,2));
    }

    let users=JSON.parse(await fs.promises.readFile(userFile,"utf8"));

    if(Array.isArray(users)){
        users={
            accounts:[],
            issues:[]
        };

        await saveUsers(users);
    }

    if(!Array.isArray(users.accounts)){
        users.accounts=[];
    }

    if(!Array.isArray(users.issues)){
        users.issues=[];
    }

    await saveUsers(users);
}

async function readBooks(){
    let data=await fs.promises.readFile(bookFile,"utf8");
    return JSON.parse(data);
}

async function saveBooks(books){
    await fs.promises.writeFile(bookFile,JSON.stringify(books,null,2));
}

async function readUsers(){
    let data=await fs.promises.readFile(userFile,"utf8");
    let users=JSON.parse(data);

    if(Array.isArray(users)){
        users={
            accounts:[],
            issues:[]
        };
    }

    if(!Array.isArray(users.accounts)){
        users.accounts=[];
    }

    if(!Array.isArray(users.issues)){
        users.issues=[];
    }

    return users;
}

async function saveUsers(users){
    await fs.promises.writeFile(userFile,JSON.stringify(users,null,2));
}

async function userLogin(){
    let users=await readUsers();

    let email=(await input("Enter your Gmail: ")).trim().toLowerCase();
    let password=await input("Enter your password: ");

    if(!email.endsWith("@gmail.com")||!password.trim()){
        console.log("Enter valid details!");
        return null;
    }

    let account=users.accounts.find(u=>u.email===email&&u.password===password);

    if(account){
        console.log("Login successful!");
        return account;
    }

    let confirmation=await input("Account not found. Create account? (yes/no): ");

    if(confirmation.trim().toLowerCase()==="yes"){
        let existingUser=users.accounts.find(u=>u.email===email);

        if(existingUser){
            console.log("Account already exists. Check your password!");
            return null;
        }

        users.accounts.push({
            email:email,
            password:password
        });

        await saveUsers(users);

        console.log("Account created successfully!");

        return users.accounts[users.accounts.length-1];
    }

    console.log("Login failed!");
    return null;
}

async function createBook(){
    let books=await readBooks();
    let id=1;

    for(let book of books){
        if(book.id>=id){
            id=book.id+1;
        }
    }

    let name=(await input("Enter book name: ")).trim();
    let author=(await input("Enter author name: ")).trim();
    let category=(await input("Enter category: ")).trim();
    let price=Number(await input("Enter price: "));
    let publisher=(await input("Enter publisher: ")).trim();

    if(!name||!author||!category||!publisher||!Number.isFinite(price)||price<0){
        console.log("Enter valid details!");
        return;
    }

    let book={
        id:id,
        name:name,
        author:author,
        category:category,
        price:price,
        publisher:publisher,
        available:true
    };

    books.push(book);

    await saveBooks(books);

    console.log("Book created successfully!");
}

async function readAllBooks(){
    let books=await readBooks();

    if(books.length===0){
        console.log("No books available!");
    }else{
        console.table(books);
    }
}

async function readBook(){
    let books=await readBooks();
    let search=(await input("Enter book ID or name: ")).trim();

    let book=books.find(b=>String(b.id)===search||b.name.toLowerCase()===search.toLowerCase());

    if(book){
        console.log(book);
    }else{
        console.log("Book not found!");
    }
}

async function updateBook(){
    let books=await readBooks();
    let id=Number(await input("Enter book ID: "));

    let book=books.find(b=>b.id===id);

    if(!book){
        console.log("Book not found!");
        return;
    }

    let name=await input("Enter new name: ");
    let author=await input("Enter new author: ");
    let category=await input("Enter new category: ");
    let priceInput=await input("Enter new price: ");
    let publisher=await input("Enter new publisher: ");

    if(name.trim()){
        book.name=name.trim();
    }

    if(author.trim()){
        book.author=author.trim();
    }

    if(category.trim()){
        book.category=category.trim();
    }

    if(publisher.trim()){
        book.publisher=publisher.trim();
    }

    if(priceInput.trim()){
        let price=Number(priceInput);

        if(!Number.isFinite(price)||price<0){
            console.log("Invalid price!");
            return;
        }

        book.price=price;
    }

    await saveBooks(books);

    console.log("Book updated successfully!");
}

async function deleteBook(){
    let books=await readBooks();
    let id=Number(await input("Enter book ID: "));

    let index=books.findIndex(b=>b.id===id);

    if(index===-1){
        console.log("Book not found!");
        return;
    }

    if(!books[index].available){
        console.log("Return the book before deleting it!");
        return;
    }

    let confirmation=await input("Confirm delete? (yes/no): ");

    if(confirmation.trim().toLowerCase()==="yes"){
        let deletedBook=books.splice(index,1);

        await saveBooks(books);

        console.log(deletedBook[0].name+" deleted successfully!");
    }else{
        console.log("Delete cancelled!");
    }
}

async function issueBook(account){
    let books=await readBooks();
    let id=Number(await input("Enter book ID: "));

    let book=books.find(b=>b.id===id);

    if(!book){
        console.log("Book not found!");
        return;
    }

    if(!book.available){
        console.log("Book is already issued!");
        return;
    }

    let name=(await input("Enter your name: ")).trim();
    let daysInput=await input("Enter issue duration in days: ");
    let days=Number(daysInput);

    if(!name||daysInput.trim()===""||!Number.isInteger(days)||days<=0){
        console.log("Enter valid details!");
        return;
    }

    console.log("Book name:",book.name);
    console.log("Author:",book.author);
    console.log("Duration:",days,"days");

    let confirmation=await input("Confirm book issue? (yes/no): ");

    if(confirmation.trim().toLowerCase()!=="yes"){
        console.log("Book issue cancelled!");
        return;
    }

    let users=await readUsers();
    let issueDate=new Date();
    let dueDate=new Date();

    dueDate.setDate(dueDate.getDate()+days);

    let record={
        userName:name,
        email:account.email,
        bookId:book.id,
        bookName:book.name,
        issueDate:issueDate.toISOString(),
        duration:days,
        dueDate:dueDate.toISOString(),
        returned:false
    };

    users.issues.push(record);
    book.available=false;

    await saveBooks(books);
    await saveUsers(users);

    console.log("Book issued successfully!");
    console.log("Due date:",dueDate.toLocaleDateString());
}

async function returnBook(account){
    let books=await readBooks();
    let users=await readUsers();

    let id=Number(await input("Enter book ID: "));
    let name=(await input("Enter your name: ")).trim();

    let record=users.issues.find(u=>u.bookId===id&&u.userName.toLowerCase()===name.toLowerCase()&&u.email===account.email&&u.returned===false);

    if(!record){
        console.log("Issue record not found!");
        return;
    }

    let book=books.find(b=>b.id===id);

    record.returned=true;
    record.returnDate=new Date().toISOString();

    if(book){
        book.available=true;
    }

    await saveBooks(books);
    await saveUsers(users);

    console.log("Book returned successfully!");
}

async function adminMenu(){
    while(true){
        console.log("\nADMIN MENU");
        console.log("1. Create Book");
        console.log("2. Update Book");
        console.log("3. Read All Books");
        console.log("4. Read Book by ID or Name");
        console.log("5. Delete Book");
        console.log("6. Exit");

        let choice=await input("Enter your choice: ");

        if(choice==="1"){
            await createBook();
        }else if(choice==="2"){
            await updateBook();
        }else if(choice==="3"){
            await readAllBooks();
        }else if(choice==="4"){
            await readBook();
        }else if(choice==="5"){
            await deleteBook();
        }else if(choice==="6"){
            break;
        }else{
            console.log("Invalid choice!");
        }
    }
}

async function userMenu(account){
    while(true){
        console.log("\nUSER MENU");
        console.log("1. Read All Books");
        console.log("2. Read Book by ID or Name");
        console.log("3. Issue Book");
        console.log("4. Return Book");
        console.log("5. Logout");

        let choice=await input("Enter your choice: ");

        if(choice==="1"){
            await readAllBooks();
        }else if(choice==="2"){
            await readBook();
        }else if(choice==="3"){
            await issueBook(account);
        }else if(choice==="4"){
            await returnBook(account);
        }else if(choice==="5"){
            console.log("Logged out successfully!");
            break;
        }else{
            console.log("Invalid choice!");
        }
    }
}

async function main(){
    await createFiles();

    while(true){
        console.log("\nLIBRARY MANAGEMENT SYSTEM");
        console.log("1. Admin");
        console.log("2. User");
        console.log("3. Exit");

        let choice=await input("Select your role: ");

        if(choice==="1"){
            await adminMenu();
        }else if(choice==="2"){
            let account=await userLogin();

            if(account){
                await userMenu(account);
            }
        }else if(choice==="3"){
            console.log("Thank you!");
            break;
        }else{
            console.log("Invalid choice!");
        }
    }

    rl.close();
}

main();
