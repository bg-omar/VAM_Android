import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-emoticon-list',
  standalone: true,
  templateUrl: './emoticon-list.component.html',
  imports: [
    IonicModule
  ],
  styleUrls: ['./emoticon-list.component.scss']
})
export class EmoticonListComponent implements OnInit{

  selectedEmoticon: string = '';

  ngOnInit(): void {
    this.selectRandomEmoticon();
  }

  selectRandomEmoticon(): void {
    const randomIndex = Math.floor(Math.random() * this.emoticons.length);
    this.selectedEmoticon = this.emoticons[randomIndex];
  }
  emoticons: string[] = [
    '★⌒ Ｙ⌒Ｙ⌒Ｙ⌒Ｙ⌒ ヾ(oﾟДﾟ)ﾉ',
    '(o^-\')b',
    'ᕙ(▀̿̿ĺ̯̿̿▀̿ ̿) ᕗ',
    '٩( ᗒᗨᗕ )۶',
    'Σ(-᷅_-᷄๑)',
    '🍔ԅ( ͒ ۝ ͒ )',
    '♡(ू•‧̫•ू⑅)',
    '( ͡~ ͜ʖ ͡° )',
    '(ノಠ益ಠ)ノ彡┻━┻',
    '༼;´༎ຶ ۝ ༎ຶ༽',
    '( ͡°з ͡°)',
    '└(・。・)┘',
    '(〜^∇^)〜',
    '¯\\_(:|)_/¯',
    '¯\\_( ͠° ͟ʖ ͠°)_/¯',
    '( ͡°- ͡°)',
    '(∿°○°)∿ ︵ ǝʌol',
    '乁( ͡ಠ ʖ̯ ͡ಠ)ㄏ',
    '♡(ﾐ ᵕ̣̣̣̣̣̣ ﻌ ᵕ̣̣̣̣̣̣ ﾐ)ﾉ',
    'ಠ ಠ',
    '(༎ຶ⌑༎ຶ)'
  ];
}
