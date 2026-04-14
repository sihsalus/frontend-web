import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder as any;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as any;
}
