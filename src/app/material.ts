import {NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';


// Angular Material Modules imported here.

@NgModule({
    imports: 
    [
        MatFormFieldModule, MatSidenavModule, MatExpansionModule, 
        MatButtonModule, MatSlideToggleModule, MatButtonToggleModule, 
        MatIconModule, MatInputModule, MatListModule, ScrollingModule,
        MatTabsModule, MatCardModule, MatPaginatorModule, MatProgressSpinnerModule,
        MatDialogModule, MatSelectModule, MatDividerModule, MatMenuModule
        
    ],
    exports: 
    [
        MatFormFieldModule, MatSidenavModule, MatExpansionModule,
        MatButtonModule, MatSlideToggleModule, MatButtonToggleModule, 
        MatIconModule, MatInputModule, MatListModule, ScrollingModule,
        MatTabsModule, MatCardModule, MatPaginatorModule, MatProgressSpinnerModule,
        MatDialogModule, MatSelectModule, MatDividerModule, MatMenuModule
        
    ],
})

export class MaterialModule{}