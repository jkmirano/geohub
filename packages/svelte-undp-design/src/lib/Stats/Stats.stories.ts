import type { Meta, StoryObj } from '@storybook/svelte';

import Stats from './Stats.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'Example/Stats',
	component: Stats,
	tags: ['docsPage'],
	argTypes: {
		card: {
			description: 'StatsCard object. Stats information to show',
			defaultValue: undefined
		},
		size: {
			type: 'string',
			description: 'Stats card size.',
			defaultValue: 'medium'
		}
	},
	parameters: {
		size: {
			values: ['small', 'medium', 'large', 'x-large']
		}
	}
} satisfies Meta<Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Primary: Story = {
	args: {
		card: {
			stat: 35,
			title: 'Percents, with very long subheader, spanning several lines',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		},
		size: 'medium'
	}
};
