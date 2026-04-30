export default function PurpleTemplate({ resume }) {
  const {
    personal: p,
    summary,
    education,
    skills,
    projects,
    certifications,
    sections,
  } = resume;

  return (
    <div
      style={{
        fontFamily: "Lato, sans-serif",
        background: "#fff",
        maxWidth: 820,
        margin: "0 auto",
        boxShadow: "0 8px 40px rgba(74,25,66,.18)",
        minHeight: 1056,
      }}
    >
      {/* Header */}
      {sections.personal && (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "4px solid #4a1942",
                overflow: "hidden",
                background: "#f5eef4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "👤"
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "#4a1942",
              padding: "30px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {p.name}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.8)",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              {p.title}
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex" }}>
        {/* Left */}
        <div
          style={{
            width: 195,
            background: "#f7f0f6",
            padding: 20,
            borderRight: "1px solid #e2d0de",
          }}
        >
          {sections.personal && (
            <>
              <PTitle>Contact</PTitle>

              {p.phone && <PItem label="Phone" value={p.phone} />}
              {p.email && <PItem label="Email" value={p.email} />}
              {p.location && <PItem label="Address" value={p.location} />}
              {p.website && <PItem label="Website" value={p.website} />}
            </>
          )}

          {sections.skills && skills?.length > 0 && (
            <>
              <PTitle>Skills</PTitle>

              {skills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 6,
                    fontSize: 12,
                    color: "#333",
                  }}
                >
                  ▸ {skill}
                </div>
              ))}
            </>
          )}

          {sections.certifications && certifications?.length > 0 && (
            <>
              <PTitle>Certifications</PTitle>

              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#777" }}>
                    {c.org}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: 1, padding: 28 }}>
          {sections.summary && summary && (
            <>
              <PTitle>Profile</PTitle>
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.8,
                }}
              >
                {summary}
              </p>
            </>
          )}

          {sections.education && education?.length > 0 && (
            <>
              <PTitle>Education</PTitle>

              {education.map((e) => (
                <Entry
                  key={e.id}
                  title={e.degree}
                  sub={e.school}
                  date={e.date}
                  desc={e.desc}
                />
              ))}
            </>
          )}

          {sections.projects && projects?.length > 0 && (
            <>
              <PTitle>Projects</PTitle>

              {projects.map((p) => (
                <Entry
                  key={p.id}
                  title={p.name}
                  date={p.date}
                  desc={p.desc}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 2,
        color: "#4a1942",
        borderBottom: "2px solid #4a1942",
        paddingBottom: 4,
        marginBottom: 14,
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

function PItem({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "#888",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#333",
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Entry({ title, sub, date, desc }) {
  return (
    <div
      style={{
        borderLeft: "2px solid #7c3a6e",
        paddingLeft: 12,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>

        {date && (
          <span
            style={{
              fontSize: 10,
              color: "#fff",
              background: "#4a1942",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {date}
          </span>
        )}
      </div>

      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "#7c3a6e",
            marginTop: 3,
          }}
        >
          {sub}
        </div>
      )}

      {desc && (
        <div
          style={{
            fontSize: 11,
            color: "#666",
            marginTop: 5,
            lineHeight: 1.6,
          }}
        >
          {desc}
        </div>
      )}
    </div>
  );
}