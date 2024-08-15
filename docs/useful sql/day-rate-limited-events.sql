select created::timestamp::date,
       count(*)
  from rate_limited_api_event rae,
       rate_limited_api rla,
       tech tch
 where rae.api_rate_limited_id = rla.id
   and rla.tech_id             = tch.id
   and tch.variant_name        = 'Google Gemini v1.5 Flash'
 group by created::timestamp::date
 order by 1 desc
 limit 7;

