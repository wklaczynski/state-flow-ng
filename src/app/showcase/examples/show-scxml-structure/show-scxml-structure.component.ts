import { Component, OnInit } from '@angular/core';
import { Scxml } from '@ssoft/state-flow/scxml/model';
import { ScxmlReader } from 'src/libs/state-flow/scxml/io';

@Component({
  selector: 'app-show-scxml-structure',
  templateUrl: './show-scxml-structure.component.html',
  styleUrls: ['./show-scxml-structure.component.scss']
})
export class ShowScxmlStructureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadScxmlData();
  }

  loadScxmlData(): void {

    const scxml = ScxmlReader.read('/my/file');







  }

}
