#!/usr/bin/env python3
"""Audit proximity/neighbor claims in entity prose against actual map coordinates.

Distance model (matches `alaria-codex map dist`): 1 hex = 5 miles, hex grid = 1.125 pin units per hex
=> ~4.44 miles per pin unit. Image space: +x = East, +y = South.
"""
import os, re, glob, json, math, sys

ENT_DIR = "content/codex/entities"
MILES_PER_UNIT = 5 / 1.125  # ~4.44 mi/pin-unit (hex grid 1.125 units across, legend 1 hex = 5 mi)

def parse(path):
    txt = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", txt, re.S)
    if not m: return None
    fm, body = m.group(1), m.group(2)
    def field(name):
        mm = re.search(rf'^{name}:\s*"?([^"\n]*)"?\s*$', fm, re.M)
        return mm.group(1).strip() if mm else None
    idv = field("id"); name = field("name"); etype = field("entityType")
    cm = re.search(r'^coordinates:\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]', fm, re.M)
    coords = (int(cm.group(1)), int(cm.group(2))) if cm else None
    zm = re.search(r'^zoomLevel:\s*(\d+)', fm, re.M)
    zoom = int(zm.group(1)) if zm else None
    am = re.search(r'^aliases:\s*\[(.*)\]', fm, re.M)
    aliases = re.findall(r'"([^"]+)"', am.group(1)) if am else []
    has_review = "review:" in fm
    return dict(id=idv, name=name, etype=etype, coords=coords, zoom=zoom,
                aliases=aliases, body=body, path=path, has_review=has_review)

ents = [e for e in (parse(p) for p in glob.glob(f"{ENT_DIR}/*.md")) if e and e["name"]]
by_id = {e["id"]: e for e in ents if e["id"]}

# name index -> only entities that HAVE coordinates (measurable). Lowercased keys.
def norm(s):
    s = re.sub(r"\s*\([^)]*\)\s*$", "", s)      # strip trailing (Town)/(Village)/(alias)
    s = re.sub(r"['\u2019]s$", "", s.strip())     # strip possessive
    s = re.sub(r"^the\s+", "", s, flags=re.I)
    return s.strip().lower()
name_idx = {}
for e in ents:
    if not e["coords"]: continue
    keys = {e["name"]} | set(e.get("aliases") or [])
    for k in list(keys):
        keys.add(re.sub(r"\s*\([^)]*\)\s*$", "", k))  # name w/o parenthetical
    for k in keys:
        nk = norm(k)
        if nk and len(nk) >= 3:
            name_idx.setdefault(nk, []).append(e)

def dist_bearing(a, b):
    dx = b[0]-a[0]; dy = b[1]-a[1]
    miles = math.hypot(dx, dy) * MILES_PER_UNIT
    # bearing: +x E, +y S, north = -y
    ang = math.degrees(math.atan2(-dy, dx))  # standard math: 0=E, 90=N
    dirs = [(0,"E"),(45,"NE"),(90,"N"),(135,"NW"),(180,"W"),(-135,"SW"),(-90,"S"),(-45,"SE")]
    best = min(dirs, key=lambda d: abs(((ang-d[0]+180)%360)-180))
    return round(miles,1), best[1]

OPP = {"N":"S","S":"N","E":"W","W":"E","NE":"SW","SW":"NE","NW":"SE","SE":"NW"}
DIRWORDS = {"north":"N","south":"S","east":"E","west":"W","northeast":"NE",
            "northwest":"NW","southeast":"SE","southwest":"SW"}

POINT_TYPES = {"town","city","poi","ruins","fortress"}
def point_like(e):
    return e["etype"] in POINT_TYPES and (e["zoom"] is None or e["zoom"] >= 3)

NUMW = {"a":1,"an":1,"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,
        "couple":2,"few":3,"several":4,"half":0.5,"week":7}
# straight-line miles coverable per travel-day by mode (road dist is >= straight line)
SPEED = {"ride":35,"sail":40,"march":20,"walk":18,"journey":22,"travel":22}

# proximity keyword patterns. group 'ref' captures the trailing phrase to resolve.
DIR_RE = re.compile(r"\b(north|south|east|west|northeast|northwest|southeast|southwest)(?:east|west)?\s+of\s+(?:the\s+)?(?P<ref>[A-Z][\w''-]+(?:\s+[A-Z][\w''-]+){0,3})")
PROX_KW = r"(?:neighbou?ring|neighbou?rs?|borders?|bordering|adjacent to|abuts|a short (?:ride|walk|journey|march|sail)(?: away)?(?: from| to)?|a day'?s (?:ride|march|journey|travel|walk|sail)(?: from| to)?|stone'?s throw(?: from)?|just (?:north|south|east|west|outside) of|close to|sister cit(?:y|ies)|on the (?:edge|outskirts|border) of|at the foot of|nestled (?:against|beside|below|beneath))"
PROX_RE = re.compile(rf"\b{PROX_KW}\s+(?:the\s+)?(?P<ref>[A-Z][\w''-]+(?:\s+[A-Z][\w''-]+){{0,3}})")
# explicit distance / travel-time, then a place name within the clause
EXPL_RE = re.compile(r"\b(?:(?P<mi>\d{1,3})\s*miles?|(?P<num>\d{1,2}|a|an|one|two|three|four|five|six|seven|couple|few|several|half|week)[\s-]+(?:days?'?\s+)?(?P<mode>ride|sail|march|walk|journey|travel)(?:\s+of\s+\w+)?)\s+(?:from|to|of|away from|east of|west of|north of|south of)\s+(?:the\s+)?(?P<ref>[A-Z][\w''-]+(?:\s+[A-Z][\w''-]+){0,3})")

STOP = {"The","A","An","Its","His","Her","Their","This","These","Those","It","She","He"}

def resolve(phrase, exclude_id):
    """greedy longest-prefix match of capitalized phrase to a known entity name w/ coords."""
    toks = phrase.split()
    for n in range(min(4,len(toks)), 0, -1):
        cand = " ".join(toks[:n])
        if cand in STOP: continue
        hit = name_idx.get(norm(cand))
        if hit:
            for e in hit:
                if e["id"] != exclude_id:
                    return e
    return None

PROX_POINT = 15.0    # two point-locations called adjacent but >this mi apart
PROX_AREA  = 45.0    # area ref centroid; only flag if absurdly far
DIR_MIN = 5.0        # below this, bearing is noise

unresolved = []      # coverage: phrases we couldn't map to a coord-bearing entity

flags = []
for e in ents:
    if not e["coords"]: continue
    body = e["body"]
    seen = set()
    subj_pt = point_like(e)
    def conf(ref): return "high" if (subj_pt and point_like(ref)) else "low"
    # proximity (closeness) claims
    for mm in PROX_RE.finditer(body):
        ref = resolve(mm.group("ref"), e["id"])
        if not ref:
            unresolved.append(("PROX", e["name"], mm.group(0).strip())); continue
        key = ("P", ref["id"])
        if key in seen: continue
        seen.add(key)
        miles, brg = dist_bearing(e["coords"], ref["coords"])
        thr = PROX_POINT if point_like(ref) else PROX_AREA
        if miles > thr:
            flags.append(dict(cls="PROX", conf=conf(ref), subj=e["name"], subj_id=e["id"],
                ref=ref["name"], ref_id=ref["id"], ref_type=ref["etype"], ref_zoom=ref["zoom"],
                miles=miles, bearing=brg, phrase=mm.group(0).strip(),
                has_review=e["has_review"], path=e["path"]))
    # directional claims
    for mm in DIR_RE.finditer(body):
        claimed = DIRWORDS.get(mm.group(1).lower())
        ref = resolve(mm.group("ref"), e["id"])
        if not claimed: continue
        if not ref:
            unresolved.append(("DIR", e["name"], mm.group(0).strip())); continue
        key = ("D", ref["id"], claimed)
        if key in seen: continue
        seen.add(key)
        miles, brg = dist_bearing(e["coords"], ref["coords"])
        if miles >= DIR_MIN and brg == OPP.get(claimed):  # opposite bearing
            flags.append(dict(cls="DIR", conf=conf(ref), subj=e["name"], subj_id=e["id"],
                ref=ref["name"], ref_id=ref["id"], ref_type=ref["etype"], ref_zoom=ref["zoom"],
                miles=miles, bearing=brg, claimed=claimed, phrase=mm.group(0).strip(),
                has_review=e["has_review"], path=e["path"]))
    # explicit distance / travel-time claims
    for mm in EXPL_RE.finditer(body):
        ref = resolve(mm.group("ref"), e["id"])
        if not ref:
            unresolved.append(("EXPL", e["name"], mm.group(0).strip())); continue
        miles, brg = dist_bearing(e["coords"], ref["coords"])
        claim_mi = None
        if mm.group("mi"):
            claim_mi = float(mm.group("mi")); tol = 1.3
        else:
            n = NUMW.get((mm.group("num") or "").lower())
            try: n = float(mm.group("num")) if n is None else n
            except: n = None
            if n is not None:
                claim_mi = n * SPEED.get(mm.group("mode"), 22); tol = 1.0
        if claim_mi and miles > claim_mi * tol and miles - claim_mi > 8:
            flags.append(dict(cls="EXPL", conf=conf(ref), subj=e["name"], subj_id=e["id"],
                ref=ref["name"], ref_id=ref["id"], ref_type=ref["etype"], ref_zoom=ref["zoom"],
                miles=miles, claim_mi=round(claim_mi,1), bearing=brg, phrase=mm.group(0).strip(),
                has_review=e["has_review"], path=e["path"]))

order = {"high":0,"low":1}
flags.sort(key=lambda f:(order.get(f.get("conf"),9), f["cls"], -f["miles"]))
json.dump(flags, open("tmp/proximity-audit.json","w"), indent=1, ensure_ascii=False)
with open("tmp/proximity-unresolved.txt","w") as u:
    for cls,subj,ph in sorted(unresolved):
        u.write(f"{cls}\t{subj}\t{ph}\n")

high = [f for f in flags if f.get("conf")=="high"]
low  = [f for f in flags if f.get("conf")=="low"]
scanned = sum(1 for e in ents if e['coords'])

def line(f):
    if f["cls"]=="DIR":
        return f"{f['miles']:6.1f}mi  claim {f['claimed']} / actual {f['bearing']}  | {f['subj']} (#{f['subj_id']}) «{f['phrase']}»"
    if f["cls"]=="EXPL":
        return f"{f['miles']:6.1f}mi  vs claimed ~{f['claim_mi']}mi  | {f['subj']} (#{f['subj_id']}) «{f['phrase']}»"
    return f"{f['miles']:6.1f}mi {f['bearing']:>2}  | {f['subj']} (#{f['subj_id']}) «{f['phrase']}» -> {f['ref']} [{f['ref_type']}]"

md = []
md.append("# Proximity Audit — prose claims vs map coordinates\n")
md.append(f"Scanned **{scanned}** coordinate-bearing entities. Distance model: ~4.44 mi/pin-unit "
          f"(5 mi/hex), straight-line = lower bound on real travel.\n")
md.append(f"- **{len(high)} HIGH-confidence** flags (both endpoints are point locations — town/city/poi/ruins/fortress, zoom≥3).\n"
          f"- **{len(low)} LOW-confidence** flags (one endpoint is a region/sea/wilderness — centroid distance is unreliable; review manually).\n"
          f"- Unresolved proximity phrases (named place not matched to a pinned entity): **{len(unresolved)}**.\n")
for conf,bucket in [("HIGH",high),("LOW",low)]:
    md.append(f"\n## {conf}-confidence mismatches ({len(bucket)})\n")
    for cls,label in [("DIR","Opposite-direction claims"),("PROX","Called near/neighbor, measured far"),("EXPL","Explicit distance/travel-time contradicted")]:
        sub=[f for f in bucket if f["cls"]==cls]
        if not sub: continue
        md.append(f"\n### {label} ({len(sub)})\n")
        for f in sub:
            rv = " _(reviewed)_" if f["has_review"] else ""
            md.append(f"- `{line(f)}`{rv}")
open("tmp/proximity-audit.md","w").write("\n".join(md)+"\n")

print(f"entities scanned: {scanned}")
print(f"HIGH-confidence flags: {len(high)} | LOW-confidence: {len(low)} | unresolved phrases: {len(unresolved)}")
for c in ("DIR","PROX","EXPL"):
    print(f"  {c}: high={sum(1 for f in high if f['cls']==c)} low={sum(1 for f in low if f['cls']==c)}")
print("\n=== HIGH-CONFIDENCE (both endpoints are point locations) ===")
for f in high: print("  "+line(f))
print("\nreports: tmp/proximity-audit.md  +  tmp/proximity-audit.json")
