import { OperatorFunction, filter } from 'rxjs';

export function filterKeyboardInput(
    captureNonAlphaNumerics: boolean,
): OperatorFunction<Event, KeyboardEvent> {
    return (source) => source.pipe(
        filter((event): event is KeyboardEvent => !!(event as KeyboardEvent).key),
        filter((event) => !captureNonAlphaNumerics || event.key.length === 1),
        filter((event) => captureNonAlphaNumerics || /^[a-zA-Z0-9]$/.test(event.key))
    );
}
