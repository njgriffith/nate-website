import { Component } from '@angular/core';

@Component({
  selector: 'app-ebay',
  standalone: true,
  imports: [],
  templateUrl: './ebay.component.html',
  styleUrl: './ebay.component.css'
})
export class EbayComponent {
  receiveBid(id: string) {
    let response = prompt('What would you like to bid?');
    if (response === null || response === '') {
      return;
    }
    let bid = parseFloat(response);
    if (Number(bid) === bid) {
      this.handleBid(id, bid);
    }
    else {
      alert("Please enter a valid number");
      return;
    }
  }

  handleBid(itemName: string, bid: number) {
    let shortName = itemName.substring(5);
    if (shortName === 'doll') {
      if (bid > 10) {
        alert('Bid accepted');
      }
      else {
        alert('Bid rejected');
      }
    }
    else if (shortName === 'art') {
      if (bid > 199.99) {
        alert('Bid accepted');
      }
      else {
        alert('How dare you');
      }
    }
    else if (shortName === 'cars') {
      alert('You know I would\'ve taken anything');
    }
    else if (shortName === 'rock') {
      if (bid > 20000) {
        alert('Bid accepted');
      }
      else {
        alert('I have recently become privy to the true power of this device, you will need a higher bid');
      }
    }
    else if (shortName === 'computer') {
      if (bid > 274.99) {
        alert('sure');
      }
      else {
        alert('too low');
      }
    }
    else if (shortName === 'dentist') {
      alert('I need these off my hands asap, what your address so I can drop them off');
    }
    else if (shortName === 'soup') {
      if (bid > 9.99) {
        alert('enjoy the soup');
      }
      else {
        alert('all out of soup');
      }
    }
    else if (shortName === 'rent') {
      if (confirm('woman?')) {
        alert('how soon can you move in?');
      }
      else {
        alert('not interested');
      }
    }
  }
}
