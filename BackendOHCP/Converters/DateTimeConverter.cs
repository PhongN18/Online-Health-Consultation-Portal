using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class DateTimeConverterToGmt7 : JsonConverter<DateTime>
{
    private static readonly TimeZoneInfo Gmt7TimeZone =
        TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Parse incoming datetime as UTC
        var utcDateTime = DateTime.SpecifyKind(reader.GetDateTime(), DateTimeKind.Utc);
        return utcDateTime;
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        // Convert to GMT+7 and write ISO string
        var utcValue = value.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
            : value.ToUniversalTime();

        var gmt7Value = TimeZoneInfo.ConvertTimeFromUtc(utcValue, Gmt7TimeZone);

        writer.WriteStringValue(gmt7Value.ToString("yyyy-MM-ddTHH:mm:ss"));
    }
}
