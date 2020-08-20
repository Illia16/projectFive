import React, { Component } from 'react';
import firebase from './firebase';
import Error from './Error';
import "./styles/app.scss";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firebaseObj: firebase.database().ref(),
            list: [],
            howMuch: [],
            userInput: "",
            userInputQuantity: "",
            ready: false,
            errorPopUp: false,
            languageInterface: {
                en: {
                    h1: "To do list",
                    item: "Item to buy/to do",
                    itemPlaceholder: "e.g. buy avocado",
                    quantity: "How much/many?",
                    quantityPlaceholder: "e.g. 3 pc, 2 kg",
                    addBtn: "ADD",
                    h2: "List of current things",
                    removeThisEl: "Remove only this item",
                    removeAllBth: "REMOVE ALL ITEMS",
                    errorMsg: "Nothing's selected",
                    closeErrorMsg: "CLOSE",
                },
                ru: {
                    h1: "Cписок дел",
                    item: "Что сделать/купить",
                    itemPlaceholder: "напр. купить авокадо",
                    quantity: "Сколько?",
                    quantityPlaceholder: "напр. 3 шт., 2 кг",
                    addBtn: "Добавить",
                    h2: "Cписок текущих дел",
                    removeThisEl: "удалить только этот элемент",
                    removeAllBth: "Удалить все элементы",
                    errorMsg: "Ничего не выбрано",
                    closeErrorMsg: "Закрыть",
                },
                cn: {
                    h1: "任務清單",
                    item: "需要買/做的物品",
                    itemPlaceholder: "例如：買酪梨",
                    quantity: "數量多少",
                    quantityPlaceholder: "例如：三袋、兩公斤",
                    addBtn: "添加",
                    h2: "目前的清單",
                    removeThisEl: "只移除這項物品",
                    removeAllBth: "清除所有物品",
                    errorMsg: "未選取任何物品",
                    closeErrorMsg: "關閉",
                }
            },
            languageCurrent: {
                h1: "To do list",
                item: "Item to buy/to do",
                itemPlaceholder: "e.g. buy avocado",
                quantity: "How much/many?",
                quantityPlaceholder: "e.g. 3 pc, 2 kg",
                addBtn: "ADD",
                h2: "List of current things",
                removeThisEl: "Remove only this item",
                removeAllBth: "REMOVE ALL ITEMS",
                errorMsg: "Nothing's selected",
                closeErrorMsg: "CLOSE",
                },
        };
    };
    
    inputChange = (e) => {
        e.preventDefault();

        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    // function that finds the number of LETTER IN THE LONGEST WORD FROM THE INPUT
    longestWord = (input) => {
        let arr = input.split(" ");
        let longestWord = 0;
        
        for (let i=0; i<arr.length; i++) {
            if (arr[i].length > longestWord) {
            longestWord = arr[i].length;
            };
        };
        return longestWord;
    };

    
    addItem = (e) => {
        e.preventDefault();

        const longestWordItem = this.longestWord(this.state.userInput);
        const longestWordQuantity = this.longestWord(this.state.userInputQuantity);

        if (this.state.userInput === "" || longestWordItem > 30 || longestWordQuantity > 30) {
            this.setState({
                errorPopUp: true,
            })
        } else {       
            const itemToAdd = this.state.userInput;
            const itemToAddQuantity = this.state.userInputQuantity;

            const newListArray = []; 
            const newHowMuch = [];

            newListArray.push(itemToAdd);
            newHowMuch.push(itemToAddQuantity);
            
            this.state.firebaseObj.update({[newListArray]: newHowMuch});
            this.updateDOM();
        };
    };

    updateDOM = () => {
        this.state.firebaseObj.on('value', (snapshot) => {
            const data = snapshot.val();
            const newListArray = [];
            const newHowMuch = [];

            for (let propertyName in data) {
                newListArray.push(propertyName);
                newHowMuch.push(data[propertyName]);
            };

            this.setState({
                list: newListArray,
                howMuch: newHowMuch,
                ready: true,
                userInput: "",
                userInputQuantity: ""
            });
        });
    }

    // removing a certain list element
    deleteList = (listEl) => {
        this.state.firebaseObj.child(listEl).remove();
    };
    
    // emptying the whole list
    deleteAll = (e) => {
        e.preventDefault();
        this.setState({
            list: [],
            howMuch: []
        });
        this.state.firebaseObj.set(null);
    };

    // getting up-to-date data from database
    componentDidMount() {
        this.updateDOM();
    };

    changeLang = (val) => {
        val.preventDefault();

        this.setState({
            languageCurrent: this.state.languageInterface[val.target.value]
        });
    };

    closeErrorPopUp = () => {
        this.setState({
            errorPopUp: false,
        });
    };

    render() {
        return (
            <main className="wrapper">
                <div className="languages">
                    <button onClick={this.changeLang} value='en' >EN</button>
                    <button onClick={this.changeLang} value='ru' >RU</button>
                    <button onClick={this.changeLang} value='cn' >CN</button>
                </div>

                <h1>{this.state.languageCurrent.h1}</h1>

                {
                
                this.state.errorPopUp ?
                <Error
                error={this.state.languageCurrent.errorMsg}
                closeWindowText={this.state.languageCurrent.closeErrorMsg}
                closeWindow={this.closeErrorPopUp}
                />
                : null
                }

                <form action="">
                    <fieldset>
                        <div className="userInputSection">
                            <label htmlFor="itemInput">{this.state.languageCurrent.item}</label>
                            <input onChange={this.inputChange} name="userInput" value={this.state.userInput} type="text" id="itemInput" placeholder={this.state.languageCurrent.itemPlaceholder} ></input>

                            <label htmlFor="itemQuantity">{this.state.languageCurrent.quantity}</label>
                            <input onChange={this.inputChange} name="userInputQuantity" value={this.state.userInputQuantity} type="text" id="itemQuantity" placeholder={this.state.languageCurrent.quantityPlaceholder}></input>

                            <button onClick={this.addItem}>{this.state.languageCurrent.addBtn}</button>
                        </div>
                    </fieldset>
                </form>

                <h2>{this.state.languageCurrent.h2}</h2>
                <ul>
                {
                    this.state.list.map( (listItem, index) => {
                        const quantity = this.state.howMuch[index]

                        return (
                            <li key={`keyFor`+listItem} className="thingsToDo">
                                <p><span>{index + 1 + '.'}</span> {listItem}</p>
                                <p>{quantity}</p>
                                <button onClick={ () => this.deleteList(listItem)} className="closeWindow" aria-label={this.state.languageCurrent.removeThisEl} title="Remove this item"><i className="fas fa-times" aria-hidden="true"></i></button>
                            </li>
                        )
                    })
                }
                </ul>

                {
                this.state.ready 
                ? <div className="removeAll"><button onClick={this.deleteAll}>{this.state.languageCurrent.removeAllBth}</button> </div> 
                : <div className="waitingClock"><img src={require("./assets/sandClock.png")} alt="waiting clock"/></div>
                }
            </main>
        );
    };
};

export default Main;