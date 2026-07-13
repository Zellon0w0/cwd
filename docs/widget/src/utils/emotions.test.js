import assert from 'node:assert/strict';
import test from 'node:test';
import { insertTextAtCursor, parseEmotionGroups } from './emotions.js';

test('parseEmotionGroups maps OwO text and image groups', () => {
	const groups = parseEmotionGroups(
		JSON.stringify({
			'颜文字': {
				type: 'emoticon',
				container: [{ icon: 'OωO', text: 'Author' }],
			},
			'阿鲁': {
				type: 'image',
				name: 'aru',
				container: [{ icon: 'angry', text: '生气' }],
			},
		})
	);

	assert.equal(groups.length, 2);
	assert.equal(groups[0].items[0].insertValue, 'OωO');
	assert.equal(groups[1].items[0].url, '/emotion/aru/angry.png');
	assert.equal(groups[1].items[0].insertValue, '<img class="tk-owo-emotion" src="/emotion/aru/angry.png" alt="生气" title="生气" />');
});

test('insertTextAtCursor inserts at selection and updates caret', () => {
	const textarea = {
		value: 'hello world',
		selectionStart: 6,
		selectionEnd: 11,
		setSelectionRange(start, end) {
			this.selectionStart = start;
			this.selectionEnd = end;
		},
	};

	const nextValue = insertTextAtCursor(textarea, 'CWD');

	assert.equal(nextValue, 'hello CWD');
	assert.equal(textarea.selectionStart, 9);
	assert.equal(textarea.selectionEnd, 9);
});
