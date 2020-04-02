import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  digitForm: FormGroup;
  dataFetchSuccess = false;
  submitted = false;
  digitInput = "";
  pageOfItems = [];
  config: any;
constructor(private route: ActivatedRoute, private router: Router ,private http: HttpClient, private formBuilder: FormBuilder) {
  this.config = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems:0
  };
}
  ngOnInit() {
    this.digitForm = this.formBuilder.group({
        digitText: ['', [Validators.required, Validators.minLength(7),Validators.maxLength(10)]],        
    })
}
get f() { console.log("F called"); return this.digitForm.controls; }

onSubmit() {
    console.log("On Submit Called",this.digitForm.invalid , this.digitInput);
    this.submitted = true;
    if (this.digitForm.invalid) {
      return;
    }
    // get page of items from api
    this.http.get<any>(`https://hobs-lite-eiot-uat.westindia.cloudapp.azure.com/FindPossibleAlphabet/FindPossibleAlphabet?number=${this.digitInput}&recordperpage=5`).subscribe(x => {
      console.log("Response",x);
      this.buildPager(x)
    });
  }
  pageChange(newPage: number) {
    console.log("Page change called",newPage);
          this.config.currentPage = newPage; 
          this.http.get<any>(`https://hobs-lite-eiot-uat.westindia.cloudapp.azure.com/FindPossibleAlphabet/FindPossibleAlphabet?number=${newPage}&recordperpage=5`).subscribe(x => {
          console.log("Response",x);
          this.buildPager(x)
        });
    }
      buildPager(items){
      console.log(items)
      console.log("totalItems,",this.config.totalItems);
      this.pageOfItems = items.data.combinationList;
      this.config.totalItems = items.data.totalNumberOfRecord;
      if(this.pageOfItems && this.pageOfItems.length>0){
        this.dataFetchSuccess = true;
      }else{
        this.dataFetchSuccess = false;
      }
    }
}
