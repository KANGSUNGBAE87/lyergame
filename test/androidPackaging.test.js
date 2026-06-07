import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manifest = readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
const variables = readFileSync('android/variables.gradle', 'utf8');
const appBuildGradle = readFileSync('android/app/build.gradle', 'utf8');
const gitignore = readFileSync('.gitignore', 'utf8');

describe('Android Play packaging', () => {
  it('targets an Android API level accepted by current Google Play requirements', () => {
    const target = variables.match(/targetSdkVersion\s*=\s*(\d+)/);
    expect(Number(target?.[1])).toBeGreaterThanOrEqual(35);
  });

  it('ships the first Play build as an offline game without network collection surface', () => {
    expect(manifest).toContain('android:allowBackup="false"');
    expect(manifest).not.toContain('android.permission.INTERNET');
  });

  it('keeps release signing configurable without committing upload-key secrets', () => {
    expect(appBuildGradle).toContain('keystore.properties');
    expect(appBuildGradle).toContain('signingConfigs');
    expect(gitignore).toContain('android/keystore.properties');
  });
});
