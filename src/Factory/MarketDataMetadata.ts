import { Output, AggregationRule } from '../Service/MarketData/Data/MarketDataEntity';
import { TimeTransform } from '../Service/MarketData/Data/MarketDataEntity';

export class MarketDataMetadata {
    _output: Output;
    constructor(output: Output) {
        this._output = output;
    }

    marketDataId = () => this._output.marketDataId;
    eTag = () => this._output.eTag;
    providerName = () => this._output.providerName;
    marketDataName = () => this._output.marketDataName;
    originalGranularity = () => this._output.originalGranularity;
    type = () => this._output.type;

    get originialTimezone(): string {
        return this._output.originalTimezone;
    }
    set originalTimezone(value: string) {
        this._output.originalTimezone = value;
    }
    _aggregationRule: AggregationRule;
    get aggregationRule(): AggregationRule {
        return this._output.aggregationRule;
    }
    set aggregationRule(value: AggregationRule) {
        this._output.aggregationRule = value;
    }

    get providerDescription(): string | undefined {
        return this._output.providerDescription;
    }
    set providerDescription(value: string | undefined) {
        this._output.providerDescription = value;
    }

    get tags(): Record<string, string[]> | undefined {
        return this._output.tags;
    }
    set tags(value: Record<string, string[]> | undefined) {
        this._output.tags = value;
    }

    _path: string;
    get path(): string {
        return this._path;
    }
    set path(value: string) {
        this._path = value;
    }

    get transform(): TimeTransform {
        return this._output.transform;
    }
    set transform(value: TimeTransform) {
        this._output.transform = value;
        this._output.transformId = this._output.transform.id;
    }

    lastUpdated = () => this._output.lastUpdated;
    dataLastWritedAt = () => this._output.dataLastWritedAt;
    dateRangeStart = () => this._output.dateRangeStart;
    dateRangeEnd = () => this._output.dateRangeEnd;
    created = () => this._output.created;

}