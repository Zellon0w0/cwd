import { describe, expect, it } from 'vitest';
import { assertValidEmotionJson, loadFeatureSettings, saveFeatureSettings } from './featureSettings';

type SettingRow = {
	key: string;
	value: string;
};

/**
 * 创建一个只覆盖 Settings 表读写行为的 D1 mock。
 *
 * @returns 带有内存存储的 mock env
 */
function createMockEnv() {
	const settings = new Map<string, string>();

	const db = {
		prepare(sql: string) {
			return {
				bind(...args: string[]) {
					return {
						async all<T extends SettingRow>() {
							const keys = args;
							const results = keys
								.filter((key) => settings.has(key))
								.map((key) => ({ key, value: settings.get(key) })) as T[];

							return { results };
						},
						async run() {
							if (sql.startsWith('REPLACE INTO Settings')) {
								settings.set(args[0], args[1]);
							}

							return { success: true };
						},
					};
				},
				async run() {
					return { success: true };
				},
			};
		},
	};

	return {
		env: {
			CWD_DB: db,
		} as any,
		settings,
	};
}

describe('featureSettings emotionJson', () => {
	it('returns empty emotion JSON when no value is saved', async () => {
		const { env } = createMockEnv();

		const settings = await loadFeatureSettings(env);

		expect(settings.emotionJson).toBe('');
	});

	it('saves and loads custom emotion JSON', async () => {
		const { env } = createMockEnv();
		const emotionJson = JSON.stringify({
			'颜文字': {
				type: 'emoticon',
				container: [{ icon: 'OωO', text: 'Author' }],
			},
		});

		await saveFeatureSettings(env, { emotionJson });
		const settings = await loadFeatureSettings(env);

		expect(settings.emotionJson).toBe(emotionJson);
	});

	it('rejects invalid emotion JSON', () => {
		expect(() => assertValidEmotionJson('{bad json')).toThrow('表情 JSON 格式不正确');
	});
});
