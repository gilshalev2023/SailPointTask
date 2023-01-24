import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';
import { AutoCompleteService } from './service/autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutoCompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Output() selectedItemEvent = new EventEmitter<string>();

  @Input() autocompletePlaceholder = '';
  @Input() autocompleteHeader = '';
  @Input() pageSize: number = 0;

  showOptions: boolean = false;
  isSearching: boolean = false;
  foundItems: any = [];
  pageIndex: number = 0;
  showMoreResults: boolean = false;

  searchQuery$ = new Subject<string>();
  searchSubscription: Observable<string> | undefined;

  constructor(private autoCompleteService: AutoCompleteService) {}

  ngOnInit() {
    // this.configureSearch(); //which one?
  }

  ngAfterViewInit() {
    this.configureSearch();
  }

  configureSearch() {
    // const searchSubscription$ = this.searchQuery$
    //Do I really need it?
    this.searchQuery$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.isSearching = true;
          this.pageIndex = 0;
        }),
        switchMap((term: string) =>
          this.autoCompleteService
            .getItems(term, this.pageIndex, this.pageSize)
            .pipe(
              catchError((error) => {
                return of({ results: [] });
              })
            )
        ),
        tap(() => {
          this.isSearching = false;
          this.showOptions = true;
          this.showMoreResults = true;
        })
      )
      .subscribe({
        error: (e) => console.error(e),
        next: (data) => {
          this.isSearching = false;
          this.foundItems = data;
        },
      });
  }

  search(searchText: string) {
    this.isSearching = true;
    this.searchQuery$.next(searchText);
  }

  selectOption(item: string) {
    this.selectedItemEvent.emit(item);
    this.searchInput.nativeElement.value = item;
    this.showOptions = false;
  }

  bringMoreResults(searchText: string) {
    this.pageIndex++;
    this.autoCompleteService
      .getItems(searchText, this.pageIndex, this.pageSize)
      .subscribe({
        error: (e) => console.error(e),
        next: (data) => {
          this.isSearching = false;
          this.foundItems = data;
        },
      });
  }
}
