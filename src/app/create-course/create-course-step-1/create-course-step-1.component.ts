import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoursesService} from '../../services/courses.service';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {CourseTitleValidator} from '../../validators/course-title.validator';
import {Course} from '../../model/course';

interface CourseCategory {
  code: string;
  description: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-course-step-1',
  templateUrl: './create-course-step-1.component.html',
  styleUrls: ['./create-course-step-1.component.scss']
})
export class CreateCourseStep1Component implements OnInit {

  form = this.fb.group({
    title: ['', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(60)
      ],
      asyncValidators: [CourseTitleValidator(this.courses)],
      updateOn: 'blur'
    }],
    releaseAt: [new Date(), Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ['', [Validators.required, Validators.minLength(3)]],
    category: ['BEGINNER', Validators.required],
  });

  courseCategories$: Observable<CourseCategory[]>;

  constructor(private fb: FormBuilder, private courses: CoursesService) {
  }

  ngOnInit() {
    this.courseCategories$ = this.courses.findCourseCategories();
  }

  get courseTitle() {
    return this.form.controls['title'];
  }

}
