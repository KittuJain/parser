%lex
%%

\s+                                                return 'S'
'Ram'|'Sita'                                       return 'NAME'
'also'                                             return 'ADVERB'
'likes'|'hates'                                    return 'VERB'
'tea'|'coffee'|'butter'|'cheese'|'biscuits'        return 'OBJECT'
'.'                                                return 'DOT'
'\n'                                               return 'NEW_LINE'
<<EOF>>                                            return 'EOF'

/lex


%start start

%% /* language grammar */

start
    : EXPRESSION S EOF
        { return $$; }
    ;

EXPRESSION
    : EXPRESSION S SENTENCE
        {$$ = $1.concat($3)}
    | SENTENCE
    ;

SENTENCE
    : NAME S VERB S OBJECT DOT
        {$$ = [{"name": $1, "verb": $3, "object": $5}]}
    | NAME S VERB S NAME DOT
        {$$ = [{"name": $1, "verb": $3, "object": $5}]}
    | NAME S ADVERB S VERB S OBJECT DOT
        {$$ = [{"name": $1, "adverb": $3, "verb": $5, "object": $7}]}
    ;