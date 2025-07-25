/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ActionButton, RangeCalendar, RangeCalendarProps} from '../src';
import {CalendarDate, getLocalTimeZone, isWeekend, today} from '@internationalized/date';
import {CalendarSwitcher, categorizeArgTypes} from './utils';
import {Custom454Calendar} from '../../../@internationalized/date/tests/customCalendarImpl';
import {DateValue} from 'react-aria';
import type {Meta, StoryObj} from '@storybook/react';
import {ReactElement, useState} from 'react';
import {style} from '../style' with {type: 'macro'};
import {useLocale} from '@react-aria/i18n';

const meta: Meta<typeof RangeCalendar<any>> = {
  component: RangeCalendar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    ...categorizeArgTypes('Events', ['onChange']),
    errorMessage: {control: {type: 'text'}},
    visibleMonths: {
      control: {
        type: 'select'
      },
      options: [1, 2, 3]
    }
  },
  title: 'RangeCalendar',
  decorators: [
    (Story) => (
      <CalendarSwitcher>
        <Story />
      </CalendarSwitcher>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

export const Example: Story = {
  args: {
    'aria-label': 'Reservation'
  }
};

export const DateUnavailable: Story = {
  args: {
    isDateUnavailable: (date: DateValue) => {
      const disabledIntervals = [[today(getLocalTimeZone()).subtract({days: 13}), today(getLocalTimeZone()), today(getLocalTimeZone()).add({weeks: 1})], [today(getLocalTimeZone()).add({weeks: 2}), today(getLocalTimeZone()).add({weeks: 3})]];
      return disabledIntervals.some((interval) => date.compare(interval[0]) > 0 && date.compare(interval[1]) < 0);
    },
    'aria-label': 'Reservation',
    allowsNonContiguousRanges: true
  }
};

export const WeekendsUnavailable: Story = {
  render: function UnavailableWeekendsRender(args) {
    let {locale} = useLocale();

    return (
      <RangeCalendar {...args} isDateUnavailable={(date) => isWeekend(date, locale)} />
    );
  },
  args: {
    'aria-label': 'Reservation',
    allowsNonContiguousRanges: true
  }
};

export const MinValue: Story = {
  args: {
    minValue: today(getLocalTimeZone()).add({days: 1}),
    'aria-label': 'Reservation'
  }
};

function ControlledFocus(props: RangeCalendarProps<DateValue>): ReactElement {
  const defaultFocusedDate = props.focusedValue ?? new CalendarDate(2019, 6, 5);
  let [focusedDate, setFocusedDate] = useState(defaultFocusedDate);
  return (
    <div
      className={style({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 16
      })}>
      <ActionButton onPress={() => setFocusedDate(defaultFocusedDate)}>Reset focused date</ActionButton>
      <RangeCalendar {...props} focusedValue={focusedDate} onFocusChange={setFocusedDate} />
    </div>
  );
}

function CustomCalendar(props: RangeCalendarProps<DateValue>): ReactElement {
  return (
    <ControlledFocus {...props} createCalendar={() => new Custom454Calendar()} focusedValue={new CalendarDate(2023, 2, 5)} />
  );
}

export const Custom454Example: Story = {
  render: (args) => <CustomCalendar {...args} />,
  args: {
    'aria-label': 'Reservation'
  }
};
