import {trigger, transition, style, animate, query, stagger} from '@angular/animations';
export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('100ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('100ms', style({ opacity: 0 }))
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('100ms', style({ opacity: 1 })),
  ])
]);

export const arrayFade = trigger('arrayFade', [
  transition(':enter, * => 0, * => -1', []),
  transition(':increment', [
    query(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      stagger(50, [
        animate('100ms', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ], { optional: true })
  ]),
  transition(':decrement', [
    query(':leave', [
      stagger(-50, [
        animate('100ms', style({ transform: 'scale(0.5)', opacity: 0 })),
      ]),
    ])
  ]),
]);
