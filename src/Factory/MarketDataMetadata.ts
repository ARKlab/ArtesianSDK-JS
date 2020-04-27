import { Output, AggregationRule } from '../Service/MarketData/Data/MarketDataEntity';
import { TimeTransform } from '../Service/MarketData/Data/MarketDataEntity';

export class MarketDataMetadata {
    _output: Output;
    constructor(output: Output) {
        this._output = output;
    }

    marketDataId = () => this._output.MarketDataId;
    eTag = () => this._output.ETag;
    providerName = () => this._output.ProviderName;
    marketDataName = () => this._output.MarketDataName;
    originalGranularity = () => this._output.OriginalGranularity;
    type = () => this._output.Type;

    get originialTimezone(): string {
        return this._output.OriginalTimezone;
    }
    set originalTimezone(value: string) {
        this._output.OriginalTimezone = value;
    }
    _aggregationRule: AggregationRule;
    get aggregationRule(): AggregationRule {
        return this._output.AggregationRule;
    }
    set aggregationRule(value: AggregationRule) {
        this._output.AggregationRule = value;
    }

    get providerDescription(): string | undefined {
        return this._output.ProviderDescription;
    }
    set providerDescription(value: string | undefined) {
        this._output.ProviderDescription = value;
    }

    get tags(): Record<string, string[]> | undefined {
        return this._output.Tags;
    }
    set tags(value: Record<string, string[]> | undefined) {
        this._output.Tags = value;
    }

    _path: string;
    get path(): string {
        return this._path;
    }
    set path(value: string) {
        this._path = value;
    }

    get transform(): TimeTransform {
        return this._output.Transform;
    }
    set transform(value: TimeTransform) {
        this._output.Transform = value;
        this._output.TransformId = this._output.Transform.id;
    }

    lastUpdated = () => this._output.LastUpdated;
    dataLastWritedAt = () => this._output.DataLastWritedAt;
    dateRangeStart = () => this._output.DateRangeStart;
    dateRangeEnd = () => this._output.DateRangeEnd;
    created = () => this._output.Created;

}